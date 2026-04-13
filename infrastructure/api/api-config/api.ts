import axios from 'axios';
import { API_BASE_URL } from '../api-url.config';
import {
  initializeBootstrapInterceptor,
  initializeRequestInterceptor,
  initializeResponseInterceptor,
} from './api.interceptor';

const api = axios.create({ baseURL: API_BASE_URL!, timeout: 12000 });

// Interceptors
initializeBootstrapInterceptor();
initializeRequestInterceptor();
initializeResponseInterceptor();

export default api;
