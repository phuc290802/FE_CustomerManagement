import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(username, password) {
      const res = await api.post('/auth/login', {
        username,
        password
      })

      this.token = res.data.token
      console.log("res.data res.datares.data", res.data)
      localStorage.setItem('token', res.data.token)
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    }
  }
})