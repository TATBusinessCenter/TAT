import axios from 'axios';

const API_URL = process.env.API_URL || 'https://api.example.com';

export const api = axios.create({ baseURL: API_URL });