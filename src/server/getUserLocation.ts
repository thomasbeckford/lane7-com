export const getUserLocation = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user-location`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting user location:', error)
    return null
  }
}
