import profileData from '@/mock/profile.json'

export interface UserProfile {
  fullName: string
  email: string
  phone: string
}

const PROFILE_STORAGE_KEY = 'userProfile'

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as UserProfile
    }
  } catch (e) {
    console.error('Error loading profile from storage:', e)
  }
  return { ...profileData }
}

function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
  } catch (e) {
    console.error('Error saving profile to storage:', e)
  }
}

let currentProfile: UserProfile = loadProfile()

export const userService = {
  /**
   * Synchronous getter used by Vuex state() to hydrate immediately.
   */
  getInitialProfile(): UserProfile {
    return currentProfile
  },

  async getProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(currentProfile), 500)
    })
  },

  async updateProfile(data: UserProfile): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentProfile = { ...data }
        saveProfile(currentProfile)
        resolve(currentProfile)
      }, 500)
    })
  },
}
