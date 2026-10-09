import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// In-memory user store for development mode when MongoDB daemon is not running locally
const inMemoryUsers = new Map();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Register a new user
 */
export const registerUser = async ({ name, email, password }) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    const error = new Error('Please provide a valid email address');
    error.statusCode = 400;
    throw error;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must be at least 6 characters long');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();

  if (isDbConnected()) {
    // Check for existing user in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error = new Error('A user with this email address already exists');
      error.statusCode = 400;
      throw error;
    }

    const newUser = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password,
    });

    const token = generateToken(newUser._id.toString());
    return {
      user: newUser.toSafeObject(),
      token,
    };
  } else {
    // In-memory fallback
    if (inMemoryUsers.has(normalizedEmail)) {
      const error = new Error('A user with this email address already exists');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const userRecord = {
      id: userId,
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    inMemoryUsers.set(normalizedEmail, userRecord);

    const token = generateToken(userId);
    return {
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
      },
      token,
    };
  }
};

/**
 * Authenticate existing user
 */
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    const error = new Error('Email and password must be valid strings');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (isDbConnected()) {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id.toString());
    return {
      user: user.toSafeObject(),
      token,
    };
  } else {
    // In-memory fallback
    const userRecord = inMemoryUsers.get(normalizedEmail);
    if (!userRecord) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(userRecord.id);
    return {
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
      },
      token,
    };
  }
};

/**
 * Retrieve user by ID
 */
export const getUserById = async (userId) => {
  if (isDbConnected()) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return null;
      }
      return user.toSafeObject();
    } catch {
      return null;
    }
  } else {
    // In-memory fallback
    for (const record of inMemoryUsers.values()) {
      if (record.id === userId) {
        return {
          id: record.id,
          name: record.name,
          email: record.email,
        };
      }
    }
    return null;
  }
};

export default {
  registerUser,
  loginUser,
  getUserById,
};
