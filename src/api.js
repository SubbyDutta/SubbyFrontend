import axios from 'axios';

// api.js


const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
});




API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;