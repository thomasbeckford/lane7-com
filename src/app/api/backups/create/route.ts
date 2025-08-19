// app/api/backups/create/route.ts
import configPromise from '@payload-config'
import fs from 'fs'
import { MongoClient } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `backup-${timestamp}.json`
    const backupDir = path.join(process.cwd(), 'backups')

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    const client = new MongoClient(process.env.DATABASE_URI!)
    await client.connect()

    const db = client.db()
    const collections = await db.listCollections().toArray()

    const backupData: {
      timestamp: string
      collections: Record<string, any[]>
    } = {
      timestamp: new Date().toISOString(),
      collections: {},
    }

    for (const col of collections) {
      const docs = await db.collection(col.name).find({}).toArray()
      backupData.collections[col.name] = docs
    }

    await client.close()

    const backupPath = path.join(backupDir, filename)
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2))

    // AGREGAR ESTO: Registrar el backup en Payload
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'backups',
      data: {
        name: `Backup ${timestamp}`,
        date: new Date().toISOString(),
        filename: filename,
        size: fs.statSync(backupPath).size,
      },
    })

    return NextResponse.json({ success: true, filename })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
