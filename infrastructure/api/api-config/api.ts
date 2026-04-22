import axios from 'axios';
import { API_BASE_URL } from '../api-url.config';
import { initializeInterceptors } from './api.interceptor';

const api = axios.create({ baseURL: API_BASE_URL!, timeout: 12000 });

initializeInterceptors(api);

export default api;
