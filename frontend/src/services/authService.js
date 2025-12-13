import api from './api'

export const AuthService = {
  register(data) {
    return api.post('/register', data)
  },

  login(data) {
    return api.post('/login', data)
  },

  logout() {
    // supprime le token côté client
    localStorage.removeItem('token')
    // si tu veux, tu peux rediriger vers /login ici
  }
}
