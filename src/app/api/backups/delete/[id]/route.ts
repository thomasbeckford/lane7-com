// app/api/backups/delete/[id]/route.ts
import configPromise from '@payload-config'
import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { getPayload } from 'payload'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const payload = await getPayload({ config: configPromise })

    // Obtener info del backup
    const backup = await payload.findByID({
      collection: 'backups',
      id,
    })

    // Eliminar archivo físico
    const backupPath = path.join(process.cwd(), 'backups', backup.filename)
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath)
      console.log(`🗑️ Archivo eliminado: ${backup.filename}`)
    }

    // Eliminar registro de Payload
    await payload.delete({
      collection: 'backups',
      id,
    })

    return NextResponse.json({
      success: true,
      message: 'Backup eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting backup:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
