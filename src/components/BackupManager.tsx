// components/BackupManager.tsx
'use client'

import { useAuth } from '@payloadcms/ui/providers/Auth'
import React, { useEffect, useState } from 'react'

interface Backup {
  id: string
  name: string
  date: string
  filename: string
  size: number
}

export const BackupManager: React.FC = () => {
  const { user } = useAuth()
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      const res = await fetch('/api/backups')
      if (res.ok) {
        const data = await res.json()
        setBackups(data.docs || [])
      }
    } catch (error) {
      console.error('Error loading backups:', error)
    }
  }

  const createBackup = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/backups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (data.success) {
        alert('Backup creado exitosamente')
        await loadBackups()
      } else {
        alert('Error creando backup')
      }
    } catch (error) {
      alert('Error creando backup')
    } finally {
      setLoading(false)
    }
  }

  const restoreBackup = async (id: string) => {
    if (!confirm('¿Estás seguro? Esto reemplazará todos los datos actuales.')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/backups/restore/${id}`, {
        method: 'POST',
      })

      const data = await res.json()

      if (data.success) {
        alert('Backup restaurado exitosamente')
      } else {
        alert('Error restaurando backup')
      }
    } catch (error) {
      alert('Error restaurando backup')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    return bytes ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : 'N/A'
  }

  const deleteBackup = async (id: string, filename: string) => {
    if (!confirm(`¿Estás seguro de eliminar el backup "${filename}"?`)) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/backups/delete/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        alert('Backup eliminado exitosamente')
        await loadBackups()
      } else {
        alert('Error eliminando backup')
      }
    } catch (error) {
      alert('Error eliminando backup')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: '#111827',
            }}
          >
            🗄️ Gestión de Backups
          </h1>
          <p
            style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '16px',
            }}
          >
            Crea y restaura backups de tu base de datos
          </p>
        </div>

        <button
          onClick={createBackup}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.2s',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {loading ? '⏳ Procesando...' : '➕ Crear Backup'}
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>TOTAL BACKUPS</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginTop: '4px' }}>
            {backups.length}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #bae6fd',
          }}
        >
          <div style={{ color: '#0369a1', fontSize: '14px', fontWeight: '600' }}>ÚLTIMO BACKUP</div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>
            {backups.length > 0 ? formatDate(backups[0].date) : 'Ninguno'}
          </div>
        </div>
      </div>

      {/* Backups List */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
            }}
          >
            Backups Disponibles
          </h2>
        </div>

        <div>
          {backups.length > 0 ? (
            backups.map((backup, index) => (
              <div
                key={backup.id}
                style={{
                  padding: '20px',
                  borderBottom: index < backups.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#111827',
                    }}
                  >
                    📦 {backup.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      fontSize: '14px',
                      color: '#6b7280',
                    }}
                  >
                    <span>📅 {formatDate(backup.date)}</span>
                    <span>💾 {formatFileSize(backup.size)}</span>
                    <span>📄 {backup.filename}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => restoreBackup(backup.id)}
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#9ca3af' : '#10b981',
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = '#059669'
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = '#10b981'
                    }}
                  >
                    🔄 Restaurar
                  </button>

                  <button
                    onClick={() => deleteBackup(backup.id, backup.filename)}
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                color: '#9ca3af',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  opacity: 0.5,
                }}
              >
                📦
              </div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#6b7280',
                }}
              >
                No hay backups disponibles
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#9ca3af',
                }}
              >
                Crea tu primer backup haciendo clic en el botón de arriba
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
