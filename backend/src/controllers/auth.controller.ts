import { Response } from 'express';
import { validationResult } from 'express-validator';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import { AuthRequest } from '../types';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: AuthRequest, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, username, password } = req.body;

    // Register user
    const result = await registerUser({ email, username, password });

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ message: error.message });
      }
    }

    res.status(500).json({ message: 'Failed to register user' });
  }
};

/**
 * Login existing user
 * POST /api/auth/login
 */
export const login = async (req: AuthRequest, res: Response) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Login user
    const result = await loginUser({ email, password });

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    res.status(500).json({ message: 'Failed to login' });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User profile retrieved',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get user profile' });
  }
};
