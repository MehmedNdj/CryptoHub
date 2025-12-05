import { pool } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput, AuthResponse, User } from '../types';

/**
 * Register a new user
 */
export const registerUser = async (
  input: RegisterInput
): Promise<AuthResponse> => {
  const { email, username, password } = input;

  // Check if user already exists
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email, username]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('User with this email or username already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Insert user into database
  const result = await pool.query<User>(
    `INSERT INTO users (email, username, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, username, created_at, updated_at`,
    [email, username, passwordHash]
  );

  const newUser = result.rows[0];

  // Create default user settings
  await pool.query(
    `INSERT INTO user_settings (user_id, theme, currency, notifications_enabled, email_alerts)
     VALUES ($1, 'light', 'USD', true, false)`,
    [newUser.id]
  );

  // Generate JWT token
  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    username: newUser.username,
  });

  return {
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    },
  };
};

/**
 * Login existing user
 */
export const loginUser = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  // Find user by email
  const result = await pool.query<User>(
    'SELECT id, email, username, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    username: user.username,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT id, email, username, created_at, updated_at FROM users WHERE id = $1',
    [userId]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
};
