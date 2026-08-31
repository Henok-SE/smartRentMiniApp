import axios from 'axios';

// Support both VITE_API_URL and VITE_API_BASE_URL
const rawBaseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const baseURL = rawBaseURL.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let status = null;

    if (error.response) {
      status = error.response.status;
      const data = error.response.data;
      if (data?.errors && Array.isArray(data.errors)) {
        message = data.errors.map(e => e.message).join('. ');
      } else {
        message = data?.error || 
                  data?.message || 
                  (status === 404 ? 'Rental agreement reference not found.' : `Server returned error (${status})`);
      }
    } else if (error.request) {
      message = 'Unable to connect to SmartRent backend server. Please verify your connection or try again later.';
    } else {
      message = error.message || message;
    }

    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

export default apiClient;
