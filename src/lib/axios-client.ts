import axios from 'axios';
import { BaseApiUrl } from '@/configs/settings';

const API = axios.create({
  baseURL: BaseApiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 100000,
});



API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Only handle specific token expiration cases
    if (error.response?.status === 401 && 
        error.response.data?.code === 'TOKEN_EXPIRED' &&
        !originalRequest._isRetry) {
      
      originalRequest._isRetry = true; // Mark request to prevent infinite loop

      try {
        // Make refresh request with special header
        await axios.post(`${BaseApiUrl}/auth/refresh`, null, {
          withCredentials: true,
          headers: { 'X-Refresh-Request': 'true' }
        });
        
        // Retry original request with new token
        return API(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/signin?session_expired=true';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // Reject other errors immediately
    return Promise.reject(error);
  }
);

export default API;





