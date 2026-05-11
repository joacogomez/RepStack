import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const register = (datos) => api.post('/auth/register', datos)
export const login = (datos) => api.post('/auth/login', datos, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})

export const getSesiones = () => api.get('/sesiones/')
export const crearSesion = (datos) => api.post('/sesiones/', datos)
export const getSesionPorFecha = (fecha) => api.get(`/sesiones/${fecha}`)
export const agregarEjercicio = (sesionId, datos) => api.post(`/sesiones/${sesionId}/ejercicios`, datos)
export const eliminarEjercicio = (ejercicioId) => api.delete(`/sesiones/ejercicios/${ejercicioId}`)