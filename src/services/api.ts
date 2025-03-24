/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: (userData: any) => apiClient.post('/auth/register', userData),
  login: (loginData: any) => apiClient.post('/auth/login', loginData),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (profileData: any) => apiClient.put('/auth/profile', profileData),
};

// Credential Services
export const credentialService = {
  issueCredential: (credentialData: any) => apiClient.post('/credentials/issue', credentialData),
  getCredentials: (params: any) => apiClient.get('/credentials', { params }),
  getCredentialDetails: (id: any) => apiClient.get(`/credentials/${id}`),
  revokeCredential: (id: any, reason: any) => apiClient.put(`/credentials/${id}/revoke`, { reason }),
  shareCredential: (id: any, shareData: any) => apiClient.post(`/credentials/${id}/share`, shareData),
};

// Institution Services
export const institutionService = {
  getStudents: (params: any) => apiClient.get('/institutions/students', { params }),
  addStudent: (studentData: any) => apiClient.post('/institutions/students', studentData),
  importStudents: (formData: any) => apiClient.post('/institutions/students/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getStudentDetails: (id: any) => apiClient.get(`/institutions/students/${id}`),
};

// Verification Services
export const verificationService = {
  verifyCredential: (verificationData: any) => apiClient.post('/verify', verificationData),
  verifySharedCredential: (shareId: any) => apiClient.get(`/verify/${shareId}`),
};

export default {
  auth: authService,
  credentials: credentialService,
  institutions: institutionService,
  verification: verificationService,
};