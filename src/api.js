import axios from 'axios';

// api.js


const API = axios.create({
 baseURL: "https://subbybankbackend.onrender.com/api",
});




API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;