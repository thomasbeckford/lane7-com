// app/api/backups/restore/[id]/route.ts
import configPromise from '@payload-config'
import fs from 'fs'
import { MongoClient, ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getPayload } from 'payload'

// app/api/backups/restore/[id]/route.ts
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const testDbUri = process.env.DATABASE_URI

    if (!testDbUri) {
      throw new Error('DATABASE_URI_TEST no está configurada')
    }

    const payload = await getPayload({ config: configPromise })

    const backup = await payload.findByID({
      collection: 'backups',
      id,
    })

    const backupPath = path.join(process.cwd(), 'backups', backup.filename)

    if (!fs.existsSync(backupPath)) {
      throw new Error('Archivo de backup no encontrado')
    }

    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'))

    const client = new MongoClient(testDbUri)
    await client.connect()
    const db = client.db()

    console.log(`🔄 Restaurando en DB de pruebas...`)

    for (const [collectionName, docs] of Object.entries(backupData.collections)) {
      console.log(`📦 Restaurando ${collectionName}...`)

      await db.collection(collectionName).deleteMany({})

      if (Array.isArray(docs) && docs.length > 0) {
        const validDocs = docs.filter((doc) => doc && typeof doc === 'object')

        const cleanDocs = validDocs
          .map((doc) => {
            if (!doc) return null

            const cleanDoc = { ...doc }

            // Convertir _id correctamente
            if (cleanDoc._id) {
              try {
                if (typeof cleanDoc._id === 'string') {
                  cleanDoc._id = new ObjectId(cleanDoc._id)
                } else if (cleanDoc._id.$oid) {
                  cleanDoc._id = new ObjectId(cleanDoc._id.$oid)
                }
              } catch (e) {
                delete cleanDoc._id
              }
            }

            // Convertir fechas correctamente
            if (cleanDoc.createdAt) {
              if (typeof cleanDoc.createdAt === 'string') {
                cleanDoc.createdAt = new Date(cleanDoc.createdAt)
              } else if (cleanDoc.createdAt.$date) {
                cleanDoc.createdAt = new Date(cleanDoc.createdAt.$date)
              }
            }

            if (cleanDoc.updatedAt) {
              if (typeof cleanDoc.updatedAt === 'string') {
                cleanDoc.updatedAt = new Date(cleanDoc.updatedAt)
              } else if (cleanDoc.updatedAt.$date) {
                cleanDoc.updatedAt = new Date(cleanDoc.updatedAt.$date)
              }
            }

            // Arreglar usuarios específicamente
            if (collectionName === 'users' || collectionName.includes('user')) {
              cleanDoc.lockUntil = cleanDoc.lockUntil || null
              cleanDoc.loginAttempts = parseInt(cleanDoc.loginAttempts) || 0
              cleanDoc.__v = parseInt(cleanDoc.__v) || 0

              // Limpiar sesiones para evitar conflictos
              if (cleanDoc.sessions) {
                cleanDoc.sessions = []
              }
            }

            // Limpiar colección de sesiones completamente
            if (collectionName === 'payload-user-sessions' || collectionName.includes('session')) {
              return null // No restaurar sesiones
            }

            return cleanDoc
          })
          .filter((doc) => doc !== null)

        if (cleanDocs.length > 0) {
          await db.collection(collectionName).insertMany(cleanDocs)
          console.log(`✅ ${collectionName}: ${cleanDocs.length} documentos`)
        }
      }
    }

    await client.close()

    return NextResponse.json({
      success: true,
      message: `Backup restaurado en DB de pruebas (sin sesiones activas)`,
    })
  } catch (error) {
    console.error('Error restoring backup:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
