import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const transactionSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().datetime(),
  paidBy: z.enum(['husband', 'wife']),
});

export const validateRegister = (req, res, next) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.errors[0].message);
  }
};

export const validateLogin = (req, res, next) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.errors[0].message);
  }
};

export const validateForgotPassword = (req, res, next) => {
  try {
    forgotPasswordSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.errors[0].message);
  }
};

export const validateTransaction = (req, res, next) => {
  try {
    transactionSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400);
    throw new Error(error.errors[0].message);
  }
};