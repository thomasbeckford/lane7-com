import { geolocation } from '@vercel/functions'

export async function GET(request: Request) {
  try {
    const details = geolocation(request)
    if (process.env.NODE_ENV === 'development' || details.region === 'dev1') {
      return Response.json({
        city: 'Lambeth',
        country: 'GB',
        flag: '🇬🇧',
        countryRegion: 'ENG',
        region: 'lhr1',
        latitude: '51.4667',
        longitude: '-0.1118',
        postalCode: 'SW2',
      })
    }

    if (!details) {
      // https://api.ipquery.io/
      const res = await fetch('https://api.ipquery.io/')
      const data = await res.json()
      return Response.json(data.location)
    }
    return Response.json(details)
  } catch (error) {
    console.error('Error getting location by Vercel function:', error)
    return Response.json({ error: 'No se pudo obtener la ubicación' }, { status: 500 })
  }
}
