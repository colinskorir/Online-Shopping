import axios from 'axios';

const instance = axios.create({
  baseURL: '/', // Adjust if your API is on a different host/port
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
