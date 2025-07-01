import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:8082/api/attendance-system',
});

Api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtToken');
  // console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Api; 