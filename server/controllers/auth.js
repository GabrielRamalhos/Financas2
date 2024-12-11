import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { getDatabase } from '../database/init.js';
import { generateId } from '../utils/ids.js';

export const registerUser = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const { name, email, password } = req.body;

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userId = generateId();

  db.prepare(`
    INSERT INTO users (id, name, email, password)
    VALUES (?, ?, ?, ?)
  `).run(userId, name, email, hashedPassword);

  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(201).json({
    id: userId,
    name,
    email,
    token,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      }),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const db = getDatabase();
  const { email } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // In a real application, you would:
  // 1. Generate a password reset token
  // 2. Save it to the database with an expiration
  // 3. Send an email with a reset link
  // For this demo, we'll just send a success response
  
  res.json({ message: 'Password reset instructions sent to your email' });
});