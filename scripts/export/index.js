import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
import path from 'path'

dotenv.config()

function cleanFolder(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true })
  }
}

const OPENAI_KEY = process.env.OPENAI_API_KEY || ''

const MANUAL_COORDS = {
  'dublin-dundrum': { latitude: 53.2878, longitude: -6.2439 },
  'milton-keynes': { latitude: 52.0406, longitude: -0.7594 },
  'london-camden': { latitude: 51.5408, longitude: -0.1434 },
  altrincham: { latitude: 53.3879, longitude: -2.3487 },
  belfast: { latitude: 54.5973, longitude: -5.9301 },
  york: { latitude: 53.96, longitude: -1.0873 },
  'dublin-chatham': { latitude: 53.3398, longitude: -6.2603 },
  cardiff: { latitude: 51.4816, longitude: -3.1791 },
  berlin: { latitude: 52.5009, longitude: 13.3759 },
  aberdeen: { latitude: 57.1497, longitude: -2.0943 },
  bath: { latitude: 51.3811, longitude: -2.359 },
  'birmingham-the-cube': { latitude: 52.4781, longitude: -1.8904 },
  'birmingham-bullring': { latitude: 52.4774, longitude: -1.895 },
  bristol: { latitude: 51.4538, longitude: -2.5973 },
  durham: { latitude: 54.7753, longitude: -1.5849 },
  edinburgh: { latitude: 55.9533, longitude: -3.1883 },
  sheffield: { latitude: 53.3781, longitude: -1.469 },
  'london-victoria': { latitude: 51.4994, longitude: -0.1319 },
  liverpool: { latitude: 53.4084, longitude: -2.9916 },
  leicester: { latitude: 52.6369, longitude: -1.1398 },
  newcastle: { latitude: 54.9783, longitude: -1.6178 },
  'manchester-deansgate': { latitude: 53.4808, longitude: -2.2426 },
}

async function geocodeWithOpenAI(address) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Return ONLY JSON with latitude/longitude: {"latitude": number, "longitude": number}',
        },
        { role: 'user', content: `Coordinates for: ${address}` },
      ],
      temperature: 0,
      max_tokens: 50,
    }),
  })

  if (!response.ok) return null

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content?.trim()
  if (!content) return null

  try {
    const coords = JSON.parse(content)
    if (coords.latitude && coords.longitude) {
      return coords
    }
    return null
  } catch {
    return null
  }
}

async function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const tempDir = './scripts/temp_images'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const filePath = path.join(tempDir, filename)

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          return resolve(false)
        }

        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          fs.writeFileSync(filePath, buffer)
          resolve(true)
        })
      })
      .on('error', () => resolve(false))
  })
}

async function processVenue(venue) {
  console.log(`Processing: ${venue.title.rendered}`)

  const images = []

  // Hero logo - solo referencia, no descarga
  if (venue.acf.hero_logo_venue?.url) {
    const filename = `${venue.slug}-hero-logo.jpg`
    images.push({
      type: 'hero_logo',
      filename,
      originalUrl: venue.acf.hero_logo_venue.url,
    })
  }

  // Hero image - solo referencia, no descarga
  if (venue.acf.hero_images_venue && venue.acf.hero_images_venue.length > 0) {
    const filename = `${venue.slug}-hero-image.jpg`
    images.push({
      type: 'hero_image',
      filename,
      originalUrl: venue.acf.hero_images_venue[0].url,
    })
  }

  // Map image - solo referencia, no descarga
  if (venue.acf.find_us_image?.url) {
    const filename = `${venue.slug}-map.jpg`
    images.push({
      type: 'map',
      filename,
      originalUrl: venue.acf.find_us_image.url,
    })
  }

  // Get coordinates
  let coords = {
    latitude: null,
    longitude: null,
  }
  const manual = MANUAL_COORDS[venue.slug]
  if (manual) {
    coords = manual
  } else if (venue.acf.address) {
    const result = await geocodeWithOpenAI(venue.acf.address)
    if (result) coords = result
  }

  // Opening hours
  const hours = [
    venue.acf.workday_1 && venue.acf.working_hours_1
      ? `${venue.acf.workday_1}: ${venue.acf.working_hours_1}`
      : '',
    venue.acf.workday_2 && venue.acf.working_hours_2
      ? `${venue.acf.workday_2}: ${venue.acf.working_hours_2}`
      : '',
    venue.acf.workday_3 && venue.acf.working_hours_3
      ? `${venue.acf.workday_3}: ${venue.acf.working_hours_3}`
      : '',
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    id: venue.id,
    slug: venue.slug,
    title: venue.title.rendered,
    hero_title: venue.acf.title_section_game || '',
    description: venue.acf.description_section_game || '',
    address: venue.acf.address || '',
    latitude: coords.latitude,
    longitude: coords.longitude,
    phone: venue.acf.phone || '',
    email: venue.acf.email || '',
    booking_url: venue.acf.book_now_games || '',
    menu_url: venue.acf.url_menu_button || '',
    opening_hours: hours,
    images,
  }
}

async function main() {
  console.log('Starting export...')

  cleanFolder('./scripts/output')
  // No limpiar temp_images porque ya las tienes
  fs.mkdirSync('./scripts/output', { recursive: true })

  const response = await fetch(
    'https://lane7stage.wpenginepowered.com/wp-json/wp/v2/venue?per_page=30',
  )

  if (!response.ok) {
    console.error('Failed to fetch venues')
    process.exit(1)
  }

  const venues = await response.json()
  console.log(`Found ${venues.length} venues`)

  const results = []
  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i]
    console.log(`[${i + 1}/${venues.length}] ${venue.title.rendered}`)
    const processed = await processVenue(venue)
    results.push(processed)
    // Sin pausa porque no estamos descargando
  }

  fs.writeFileSync('./scripts/output/venues.json', JSON.stringify(results, null, 2))

  console.log(`Export completed: ${results.length} venues`)
  console.log(`Image references created: ${results.reduce((acc, v) => acc + v.images.length, 0)}`)
}

main().catch(console.error)
