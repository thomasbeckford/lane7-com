export const getUserLocation = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/user-location')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting user location:', error)
    return null
  }
}
