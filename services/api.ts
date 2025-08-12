
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://192.168.173.251:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers['x-auth-token'] = `${token}`;
  }
  return config;
});

export default api;
