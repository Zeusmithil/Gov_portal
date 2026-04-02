// ------------------------------------
// Real Authentication & Services endpoints
// -----------------------------------------------------------------
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Hits your FastAPI server
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function apiLogin(email, password) {
  try {
    const response = await apiClient.post('/login', { email, password });
    return response.data; // { token, user }
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
}

export async function apiRegister(name, email, password) { 
  try {
    const response = await apiClient.post('/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
}

// ------------------------------------
// Services endpoints
// ------------------------------------
export async function getServices() {
  try {
    const response = await apiClient.get('/services');
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch services", error);
    return []; // fallback so your UI doesn't crash on error
  }
}

export async function getService(serviceName) {
  try {
    const response = await apiClient.get(`/services/${serviceName}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch service", error);
    return null;
  }
}

export async function getSubService(serviceId, subServiceId) {
  try {
    const response = await apiClient.get(`/services/${serviceId}/subservices/${subServiceId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sub-service", error);
    return null;
  }
}

// ------------------------------------
// Document Storage & Validation
// ------------------------------------
export async function apiUpload(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload failed", error);
    throw new Error('Upload failed');
  }
}

export async function apiValidate(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post('/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Validation failed", error);
    throw new Error('Validation failed');
  }
}

export async function apiFormat(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let verb = action
      if (action === 'compress') verb = 'compressed'
      if (action === 'convert') verb = 'converted'
      if (action === 'resize') verb = 'resized'
      resolve({ message: `Document successfully ${verb}` })
    }, 1200)
  })
}
