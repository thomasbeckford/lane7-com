import fs from 'fs'
import https from 'https'
import path from 'path'

async function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const tempDir = './scripts/temp_images'
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true })

    const filePath = path.join(tempDir, filename)

    // Si ya existe, no descargar de nuevo
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ Already exists: ${filename}`)
      return resolve(true)
    }

    console.log(`  📥 Downloading: ${filename}`)

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          console.log(`  ❌ Failed to download ${filename}: Status ${res.statusCode}`)
          return resolve(false)
        }

        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          fs.writeFileSync(filePath, buffer)
          console.log(`  ✅ Downloaded: ${filename}`)
          resolve(true)
        })
      })
      .on('error', (error) => {
        console.log(`  ❌ Error downloading ${filename}: ${error.message}`)
        resolve(false)
      })
  })
}

async function downloadAllImages() {
  console.log('Starting image download...')

  // Fetch venues from WordPress
  const response = await fetch(
    'https://lane7stage.wpenginepowered.com/wp-json/wp/v2/venue?per_page=30',
  )

  if (!response.ok) {
    console.error('Failed to fetch venues')
    process.exit(1)
  }

  const venues = await response.json()
  console.log(`Found ${venues.length} venues`)

  let totalImages = 0
  let downloadedImages = 0

  for (let i = 0; i < venues.length; i++) {
    const venue = venues[i]
    console.log(`\n[${i + 1}/${venues.length}] ${venue.title.rendered}`)

    // Hero logo
    if (venue.acf.hero_logo_venue?.url) {
      totalImages++
      const filename = `${venue.slug}-hero-logo.jpg`
      const success = await downloadImage(venue.acf.hero_logo_venue.url, filename)
      if (success) downloadedImages++
    }

    // Hero image
    if (venue.acf.hero_images_venue && venue.acf.hero_images_venue.length > 0) {
      totalImages++
      const filename = `${venue.slug}-hero-image.jpg`
      const success = await downloadImage(venue.acf.hero_images_venue[0].url, filename)
      if (success) downloadedImages++
    }

    // Map image
    if (venue.acf.find_us_image?.url) {
      totalImages++
      const filename = `${venue.slug}-map.jpg`
      const success = await downloadImage(venue.acf.find_us_image.url, filename)
      if (success) downloadedImages++
    }

    // Pausa para no saturar el servidor
    await new Promise((r) => setTimeout(r, 500))
  }

  console.log(`\n📥 Download completed:`)
  console.log(`✅ Downloaded: ${downloadedImages}/${totalImages} images`)
  console.log(`📁 Images saved in: ./scripts/temp_images/`)
}

downloadAllImages().catch(console.error)
