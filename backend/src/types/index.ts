import { Request } from 'express';

// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserSettings {
  user_id: number;
  theme: 'light' | 'dark';
  currency: string;
  notifications_enabled: boolean;
  email_alerts: boolean;
  created_at: Date;
  updated_at: Date;
}

// Auth Types
export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

// Express Request with User
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    username: string;
  };
}

// API Response Types
export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}

export interface ApiSuccess<T = any> {
  message: string;
  data?: T;
}
