import axios from 'axios';
export const BASE_URL ="http://localhost:8011"

export const clientServer = axios.create({
  baseURL: BASE_URL
});