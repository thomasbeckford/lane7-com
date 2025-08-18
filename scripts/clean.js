import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

// Configuración de la API - ajusta según tu setup
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api'
const API_TOKEN = process.env.API_TOKEN || ''

// Función para hacer requests a la API
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  // Agregar token si existe
  if (API_TOKEN) {
    defaultHeaders['Authorization'] = `Bearer ${API_TOKEN}`
  }

  const config = {
    headers: defaultHeaders,
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API Error ${response.status}: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error.message)
    throw error
  }
}

async function deleteAllVenues() {
  console.log('🗑️  Deleting all venues from Payload...')

  try {
    // Obtener todos los venues
    const venues = await apiRequest('/venues?limit=1000')

    if (!venues.docs || venues.docs.length === 0) {
      console.log('ℹ️  No venues found to delete')
      return
    }

    console.log(`Found ${venues.docs.length} venues to delete`)

    // Eliminar cada venue
    for (let i = 0; i < venues.docs.length; i++) {
      const venue = venues.docs[i]
      try {
        await apiRequest(`/venues/${venue.id}`, { method: 'DELETE' })
        console.log(`  ✅ Deleted venue: ${venue.title || venue.slug || venue.id}`)
      } catch (error) {
        console.log(`  ❌ Failed to delete venue ${venue.id}: ${error.message}`)
      }
    }

    console.log('✅ All venues deleted')
  } catch (error) {
    console.log(`❌ Error deleting venues: ${error.message}`)
  }
}

async function deleteAllMedia() {
  console.log('🗑️  Deleting all media from Payload...')

  try {
    // Obtener todos los media
    const media = await apiRequest('/media?limit=1000')

    if (!media.docs || media.docs.length === 0) {
      console.log('ℹ️  No media found to delete')
      return
    }

    console.log(`Found ${media.docs.length} media files to delete`)

    // Eliminar cada media
    for (let i = 0; i < media.docs.length; i++) {
      const mediaFile = media.docs[i]
      try {
        await apiRequest(`/media/${mediaFile.id}`, { method: 'DELETE' })
        console.log(`  ✅ Deleted media: ${mediaFile.filename || mediaFile.alt || mediaFile.id}`)
      } catch (error) {
        console.log(`  ❌ Failed to delete media ${mediaFile.id}: ${error.message}`)
      }
    }

    console.log('✅ All media deleted')
  } catch (error) {
    console.log(`❌ Error deleting media: ${error.message}`)
  }
}

async function cleanPayload() {
  if (!API_BASE_URL) {
    console.log('⚠️  No API_BASE_URL configured, skipping Payload cleanup')
    return
  }

  try {
    // Verificar conexión con la API
    console.log('🔌 Testing API connection...')
    await apiRequest('/venues?limit=1')
    console.log('✅ API connection successful')

    // Limpiar venues y media
    await deleteAllVenues()
    await deleteAllMedia()

    console.log('🧹 Payload cleanup completed!')
  } catch (error) {
    console.log('❌ Failed to connect to Payload API:', error.message)
    console.log('⚠️  Skipping Payload cleanup')
  }
}

async function main() {
  console.log('Starting full cleanup...')

  // Limpiar archivos locales
  if (fs.existsSync('./scripts/temp_images')) {
    fs.rmSync('./scripts/temp_images', { recursive: true, force: true })
    console.log('✅ Cleaned up temp_images')
  } else {
    console.log('ℹ️  temp_images directory not found')
  }

  if (fs.existsSync('./scripts/output')) {
    fs.rmSync('./scripts/output', { recursive: true, force: true })
    console.log('✅ Cleaned up output')
  } else {
    console.log('ℹ️  output directory not found')
  }

  // Limpiar Payload
  await cleanPayload()

  console.log('🧹 Full cleanup completed!')
}

main().catch(console.error)
