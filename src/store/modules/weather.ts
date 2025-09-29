import { getWeatherCurrent } from '@/services/weatherService'
import type { WeatherData } from '@/services/weatherService'
import type { Module, ActionContext } from 'vuex'
import type { RootState } from '@/store'

export interface WeatherState {
  currentWeather: WeatherData[]
}

function sameCities(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  return [...a].sort().join('|') === [...b].sort().join('|')
}

export const weather: Module<WeatherState, RootState> = {
  namespaced: true,

  state: (): WeatherState => ({
    currentWeather: [],
  }),

  mutations: {
    SET_CURRENT_WEATHER(state, data: WeatherData[]) {
      state.currentWeather = data
    },
    CLEAR_CURRENT_WEATHER(state) {
      state.currentWeather = []
    },
  },

  actions: {
    async fetchCurrentWeather(
      { commit, state }: ActionContext<WeatherState, RootState>,
      payload: { cities: string[]; force?: boolean }
    ): Promise<WeatherData[]> {
      const { cities, force = false } = payload

      if (!force && state.currentWeather.length > 0) {
        const cached = state.currentWeather.map((w) => w.city)
        if (sameCities(cached, cities)) return state.currentWeather
      }

      commit('ui/SET_LOADING', true, { root: true })
      //   commit('ui/SET_ERROR', null, { root: true })

      try {
        const weather = await getWeatherCurrent(cities)
        commit('SET_CURRENT_WEATHER', weather)
        return weather
      } catch (err) {
        console.error('Failed to fetch weather:', err)
        // commit('ui/SET_ERROR', 'Could not load weather data', { root: true })
        return []
      } finally {
        commit('ui/SET_LOADING', false, { root: true })
      }
    },
  },
}
