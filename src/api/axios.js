import axios from 'axios';

const api = axios.create({
      baseURL: '/api',
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000, // 10s timeout so it doesn't hang forever if backend is down
});

// Attach token from localStorage to every request
api.interceptors.request.use(
      (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                  config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
      },
      (error) => Promise.reject(error)
);

// Handle 401 globally — but only redirect on non-auth pages
api.interceptors.response.use(
      (response) => response,
      (error) => {
            if (error.response?.status === 401) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  const authPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
                  const isAuthPage = authPaths.some((p) => window.location.pathname.startsWith(p));
                  const isRoot = window.location.pathname === '/';
                  if (!isAuthPage && !isRoot) {
                        window.location.href = '/login';
                  }
            }
            return Promise.reject(error);
      }
);

export default api;
