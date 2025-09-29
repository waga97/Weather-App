import { createStore, Store } from 'vuex'
import { user, type UserState } from './modules/user'
import { weather, type WeatherState } from './modules/weather'
import { ui, type UiState } from './modules/ui'
import type { InjectionKey } from 'vue'

export interface RootState {
  user: UserState
  weather: WeatherState
  ui: UiState
}

const store = createStore<RootState>({
  modules: {
    user,
    weather,
    ui,
  },
})

export const key: InjectionKey<Store<RootState>> = Symbol()

export default store
