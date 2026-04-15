import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Hits your FastAPI server
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('unavoidable_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// ------------------------------------
// Strict Backend Auth Calls
// ------------------------------------
export async function apiLogin(email, password) {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data; // { token, user }
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed Check your credentials.');
  }
}

export async function apiRegister(name, email, password) {
  try {
    const response = await apiClient.post('/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed.');
  }
}

export async function apiRequestPasswordReset(email) {
  try {
    const response = await apiClient.post('/request-password-reset', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Password reset request failed.');
  }
}

export async function apiExecutePasswordReset(token, newPassword) {
  try {
    const response = await apiClient.post('/reset-password', {
      token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Unable to reset password.');
  }
}

// ------------------------------------
// Local Frontend Service Calls
// ------------------------------------
export async function getServices() {
  try {
    const res = await apiClient.get('/services');
    return res.data.success ? res.data.services : [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function getService(serviceId) {
  try {
    const res = await apiClient.get(`/services/${serviceId}`);
    return res.data.success ? res.data.service : null;
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return null;
  }
}

export async function getSubService(serviceId, subServiceId) {
  try {
    const res = await apiClient.get(`/subservices/${serviceId}/${subServiceId}`);
    return res.data.success ? res.data.subservice : null;
  } catch (error) {
    console.error("Failed to fetch subservice:", error);
    return null;
  }
}


