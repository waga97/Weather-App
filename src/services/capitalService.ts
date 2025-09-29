import userCapitals from '@/mock/userCapitals.json'

export interface UserCapital {
  country: string
  city: string
  myLocation?: boolean
}

const CAPITAL_STORAGE_KEY = 'userCapitals'
const MY_LOC_SESSION_KEY = 'myLocationCapital'

function loadFromSession(): { city: string; country: string } | null {
  try {
    const raw = sessionStorage.getItem(MY_LOC_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveCapitals(capitals: UserCapital[]): void {
  localStorage.setItem(CAPITAL_STORAGE_KEY, JSON.stringify(capitals))
}

function mergeMyLocation(capitals: UserCapital[]): UserCapital[] {
  const myLoc = loadFromSession()

  if (!myLoc) return capitals

  // Check if myLocation flag is already set in the list
  if (capitals.some((c) => c.myLocation)) {
    return capitals
  }

  // Check if the city already exists without the flag
  const idx = capitals.findIndex((c) => c.city === myLoc.city)
  if (idx >= 0) {
    return capitals.map((c, i) => (i === idx ? { ...c, myLocation: true } : c))
  }

  // Add the location as the first element with the flag
  return [{ ...myLoc, myLocation: true }, ...capitals]
}

function loadCapitals(): UserCapital[] {
  const stored = localStorage.getItem(CAPITAL_STORAGE_KEY)
  const baseCapitals = stored ? JSON.parse(stored) : [...userCapitals]

  return mergeMyLocation(baseCapitals)
}

let currentMyCapitals: UserCapital[] = loadCapitals()

export const capitalService = {
  /**
   * Synchronous getter for Vuex state hydration.
   */
  getInitialCapitals(): UserCapital[] {
    return currentMyCapitals
  },

  async getCapitals(): Promise<UserCapital[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...currentMyCapitals])
      }, 300)
    })
  },

  async updateCapitals(data: UserCapital): Promise<UserCapital[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!currentMyCapitals.some((c) => c.city === data.city)) {
          currentMyCapitals.push(data)
        }

        currentMyCapitals = mergeMyLocation(currentMyCapitals)
        saveCapitals(currentMyCapitals)
        resolve([...currentMyCapitals])
      }, 300)
    })
  },

  async removeCapital(city: string): Promise<UserCapital[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentMyCapitals = currentMyCapitals.filter((c) => !(c.city === city && c.myLocation))

        currentMyCapitals = mergeMyLocation(currentMyCapitals)
        saveCapitals(currentMyCapitals)
        resolve([...currentMyCapitals])
      }, 300)
    })
  },
}
