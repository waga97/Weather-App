import { type Module } from 'vuex'

export interface UiState {
  loading: boolean
  error: string | null
  success: string | null
}

export const ui: Module<UiState, unknown> = {
  namespaced: true,

  state(): UiState {
    return {
      loading: false,
      error: null,
      success: null,
    }
  },

  mutations: {
    SET_LOADING(state, value: boolean) {
      state.loading = value
    },
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
    SET_SUCCESS(state, success: string | null) {
      state.success = success
    },
  },
}
