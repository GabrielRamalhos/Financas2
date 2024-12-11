import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { getDatabase } from '../database/init.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const db = getDatabase();
      const user = db.prepare(`
        SELECT id, name, email FROM users WHERE id = ?
      `).get(decoded.id);

      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});