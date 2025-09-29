import { worldCapitals } from '@/configs/worldCapitals'
import { type UserCapital } from '@/services/capitalService'

export function getCoordinates(city: string): { latitude: number; longitude: number } {
  const match = worldCapitals.find((c) => c.city.toLowerCase() === city.toLowerCase())
  if (!match) {
    throw new Error(`City "${city}" not found in configs`)
  }

  // Round to 1 decimal place
  const latitude = Math.round(match.latitude * 10) / 10
  const longitude = Math.round(match.longitude * 10) / 10

  return { latitude, longitude }
}

const COUNTRY_KEY = 'user_country'
const MY_LOC_KEY = 'myLocationCapital'

async function getMyCountry(): Promise<string | null> {
  const cached = localStorage.getItem(COUNTRY_KEY)
  if (cached) return cached

  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()

    if (data?.country_name) {
      localStorage.setItem(COUNTRY_KEY, data.country_name)
      return data.country_name
    }
    return null
  } catch (err) {
    console.error('Failed to fetch country:', err)
    return null
  }
}

function getCapitalForCountry(country: string): UserCapital | null {
  const lower = country.toLowerCase()
  const found = worldCapitals.find((c) => c.country.toLowerCase() === lower)

  return found ? { city: found.city, country: found.country, myLocation: true } : null
}

export async function detectAndSaveMyLocation(): Promise<UserCapital | null> {
  const country = await getMyCountry()
  if (!country) return null

  const capital = getCapitalForCountry(country)
  if (!capital) return null

  sessionStorage.setItem(MY_LOC_KEY, JSON.stringify(capital))
  return capital
}
