import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const VENUES_FILE_PATH = path.join(__dirname, '../output/venues.json')
const TEMP_IMAGES_PATH = './scripts/temp_images' // Ruta corregida

// Configuración de la API - ajusta según tu setup
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api'
const API_TOKEN = process.env.API_TOKEN || ''

function loadVenuesData() {
  const rawData = fs.readFileSync(VENUES_FILE_PATH, 'utf8')
  return JSON.parse(rawData)
}

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

// Subir imagen a la API
async function uploadImageToAPI(imagePath, filename, altText) {
  if (!fs.existsSync(imagePath)) {
    console.log(`Image not found: ${imagePath}`)
    return null
  }

  try {
    // Leer el archivo
    const buffer = fs.readFileSync(imagePath)
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    }
    const mimeType = mimeTypes[ext] || 'image/jpeg'

    // Crear FormData usando la API nativa de Node.js
    const formData = new FormData()

    // Crear un Blob desde el buffer
    const imageBlob = new Blob([buffer], { type: mimeType })

    formData.append('file', imageBlob, filename)
    formData.append('alt', altText)

    // Headers
    const headers = {}
    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`
    }

    console.log(`    📤 Uploading ${filename} (${buffer.length} bytes, ${mimeType})`)

    const response = await fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`    ❌ Upload failed ${response.status}: ${errorText}`)
      return null
    }

    const result = await response.json()
    console.log(`    ✅ Upload success:`, result)

    return result.id || result._id || result.data?.id || result.doc?.id
  } catch (error) {
    console.log(`    ❌ Upload error: ${error.message}`)
    return null
  }
}

// Verificar si venue existe
async function checkVenueExists(slug) {
  try {
    const result = await apiRequest(`/venues?where[slug][equals]=${slug}&limit=1`)
    return result.docs && result.docs.length > 0 ? result.docs[0] : null
  } catch (error) {
    console.log(`Error checking venue existence: ${error.message}`)
    return null
  }
}

// Crear venue via API
async function createVenue(venueData) {
  return await apiRequest('/venues', {
    method: 'POST',
    body: JSON.stringify(venueData),
  })
}

// Actualizar venue via API
async function updateVenue(venueId, venueData) {
  return await apiRequest(`/venues/${venueId}`, {
    method: 'PATCH',
    body: JSON.stringify(venueData),
  })
}

async function importVenueViaAPI(venue) {
  console.log(`  Processing images...`)

  const processedImages = []

  // Mapeo de tipos de imagen
  const TYPE_MAP = {
    hero_logo: 'hero_logo',
    hero_image: 'hero_image',
    map: 'find_us',
  }

  // Procesar cada imagen
  for (const image of venue.images) {
    const imagePath = path.join(TEMP_IMAGES_PATH, image.filename) // Usar la ruta correcta
    const altText = `${image.type} for ${venue.title}`

    console.log(`    🔍 Checking: ${imagePath}`)
    console.log(`    📁 File exists: ${fs.existsSync(imagePath)}`)

    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath)
      console.log(`    📊 File size: ${stats.size} bytes`)
    }

    const mediaId = await uploadImageToAPI(imagePath, image.filename, altText)

    if (mediaId) {
      const normalizedType = TYPE_MAP[image.type] || image.type
      processedImages.push({
        type: normalizedType,
        image: mediaId,
      })
      console.log(`    ✅ ${image.type}: ${mediaId}`)
    } else {
      console.log(`    ❌ Failed to upload ${image.filename}`)
    }
  }

  // Verificar si el venue ya existe
  console.log(`  Checking if venue exists...`)
  const existingVenue = await checkVenueExists(venue.slug)

  // Datos del venue
  const venueData = {
    title: venue.title,
    slug: venue.slug,
    hero_title: venue.hero_title,
    description: venue.description,
    address: venue.address,
    latitude: venue.latitude,
    longitude: venue.longitude,
    phone: venue.phone,
    email: venue.email,
    booking_url: venue.booking_url,
    menu_url: venue.menu_url,
    opening_hours: venue.opening_hours,
    images: processedImages,
  }

  // Crear o actualizar venue
  let result
  if (existingVenue) {
    console.log(`  Updating existing venue via API...`)
    result = await updateVenue(existingVenue.id || existingVenue._id, venueData)
  } else {
    console.log(`  Creating new venue via API...`)
    result = await createVenue(venueData)
  }

  return result
}

async function importMain() {
  console.log('Starting import via API...')
  console.log(`API Base URL: ${API_BASE_URL}`)

  if (!fs.existsSync(VENUES_FILE_PATH)) {
    console.error('venues.json not found. Run export first.')
    process.exit(1)
  }

  // Verificar conexión con la API
  try {
    console.log('Testing API connection...')
    await apiRequest('/venues?limit=1')
    console.log('✅ API connection successful')
  } catch (error) {
    console.error('❌ Failed to connect to API:', error.message)
    console.error('Check your API_BASE_URL and API_TOKEN in .env')
    process.exit(1)
  }

  const venues = loadVenuesData()
  console.log(`Found ${venues.length} venues to import`)

  let successful = 0
  let failed = 0

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i]
    console.log(`\n[${i + 1}/${venues.length}] ${venue.title}`)

    try {
      // Importar venue via API
      const result = await importVenueViaAPI(venue)

      console.log(`✅ Venue saved: ${venue.title} (ID: ${result.id || result._id})`)
      successful++
    } catch (error) {
      console.log(`❌ Failed to process ${venue.title}: ${error.message}`)
      failed++
    }

    // Pausa entre venues
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`\nImport completed:`)
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)

  // Clean up temp images
  if (fs.existsSync(TEMP_IMAGES_PATH)) {
    fs.rmSync(TEMP_IMAGES_PATH, { recursive: true, force: true })
    console.log('Cleaned up temp_images')
  }
}

importMain().catch(console.error)
