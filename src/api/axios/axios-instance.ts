import axios from 'axios'
import { envs } from '../../config/envs'

const axiosInstance = axios.create({
  baseURL: envs.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance
