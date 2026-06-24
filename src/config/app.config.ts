import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: 'https://openexchangerates.org/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
