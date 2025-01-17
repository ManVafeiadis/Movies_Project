// src/services/api.ts

import axios from 'axios';
import { Movie, Review } from '../types';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const MovieService = {
  getAll: () => api.get<Movie[]>('/movies/'),
  getOne: (id: number) => api.get<Movie>(`/movies/${id}/`),
  create: (movie: Omit<Movie, 'id' | 'reviews'>) => 
    api.post<Movie>('/movies/', movie),
  delete: (id: number) => api.delete(`/movies/${id}/`),
};

export const ReviewService = {
  create: (movieId: number, review: { review: string; rating: number }) =>
    api.post(`/movies/${movieId}/review/`, review),
  update: (reviewId: number, review: { review: string; rating: number }) =>
    api.put(`/reviews/${reviewId}/`, review),
  delete: (reviewId: number) => api.delete(`/reviews/${reviewId}/`),
};

export const AuthService = {
  login: (username: string, password: string) =>
    api.post('/token/', { username, password }),
  register: (userData: { 
    username: string; 
    email: string; 
    password1: string; 
    password2: string; 
  }) => api.post('/auth/registration/', userData),
  refreshToken: (refresh: string) =>
    api.post('/token/refresh/', { refresh }),
};
