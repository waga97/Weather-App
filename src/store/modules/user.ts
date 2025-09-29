import { type Module } from 'vuex'
import { userService, type UserProfile } from '@/services/userService'
import { capitalService, type UserCapital } from '@/services/capitalService'
import type { RootState } from '@/store'
import { detectAndSaveMyLocation } from '@/helpers/capitals'

export interface UserState {
  profile: UserProfile | undefined
  capitals: UserCapital[] | undefined
}

export const user: Module<UserState, RootState> = {
  namespaced: true,

  state(): UserState {
    return {
      profile: userService.getInitialProfile(),
      capitals: capitalService.getInitialCapitals(),
    }
  },

  mutations: {
    SET_PROFILE(state, profile: UserProfile) {
      state.profile = profile
    },
    SET_CAPITALS(state, capitals: UserCapital[]) {
      state.capitals = capitals
    },
  },

  actions: {
    async fetchProfile({ commit }): Promise<void> {
      commit('ui/SET_LOADING', true, { root: true })
      commit('ui/SET_ERROR', null, { root: true })
      try {
        const profile = await userService.getProfile()
        commit('SET_PROFILE', profile)
      } catch {
        // commit('ui/SET_ERROR', 'Failed to load profile', { root: true })
      } finally {
        commit('ui/SET_LOADING', false, { root: true })
      }
    },

    async updateProfile({ commit }, profileData: UserProfile): Promise<void> {
      commit('ui/SET_LOADING', true, { root: true })
      commit('ui/SET_ERROR', null, { root: true })
      try {
        const updatedProfile = await userService.updateProfile(profileData)
        commit('SET_PROFILE', updatedProfile)
        // commit('ui/SET_SUCCESS', 'Profile updated successfully!', { root: true })
      } catch (error: unknown) {
        // commit('ui/SET_ERROR', 'Failed to update profile.', { root: true })
        if (error instanceof Error) {
          console.error('Profile update failed:', error.message)
        } else {
          console.error('Profile update failed:', error)
        }
      } finally {
        commit('ui/SET_LOADING', false, { root: true })
      }
    },

    async fetchCapitals({ commit }) {
      try {
        await detectAndSaveMyLocation()

        const capitals = await capitalService.getCapitals()
        commit('SET_CAPITALS', capitals) // Fetches the merged and saved list
      } catch {
        // Fallback to the initial state from the service's cache
        const initialCapitals = capitalService.getInitialCapitals()
        commit('SET_CAPITALS', initialCapitals)
      }
    },

    async updateCapitals({ commit }, data: UserCapital) {
      try {
        const updated = await capitalService.updateCapitals(data)
        commit('SET_CAPITALS', updated)
      } catch {
        // Fallback to the initial state from the service's cache
        const initialCapitals = capitalService.getInitialCapitals()
        commit('SET_CAPITALS', initialCapitals)
      }
    },

    async removeCapitals({ commit }, city: string) {
      try {
        const updated = await capitalService.removeCapital(city)
        commit('SET_CAPITALS', updated)
      } catch {
        // Fallback to the initial state from the service's cache
        const initialCapitals = capitalService.getInitialCapitals()
        commit('SET_CAPITALS', initialCapitals)
      }
    },
  },
}
