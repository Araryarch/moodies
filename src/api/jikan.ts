import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
