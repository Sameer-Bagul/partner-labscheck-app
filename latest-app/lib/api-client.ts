import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { env } from '@/config/env';

const apiClient = axios.create({
  baseURL: env.api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: env.api.timeout,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      return Promise.reject(new Error('Session expired. Please sign in again.'));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
