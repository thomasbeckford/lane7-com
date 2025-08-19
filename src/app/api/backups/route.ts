// app/api/backups/route.ts
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    const backups = await payload.find({
      collection: 'backups',
      sort: '-date',
      limit: 50,
    })

    return NextResponse.json(backups)
  } catch (error) {
    console.error('Error fetching backups:', error)
    return NextResponse.json({ error: 'Error obteniendo backups' }, { status: 500 })
  }
}
