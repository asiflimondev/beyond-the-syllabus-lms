import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth.types.js';

// Access Token - Short lived
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  
  // Use any to bypass TypeScript strict checking
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

// Refresh Token - Longer lived
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  const expiresIn = process.env.JWT_REFRESH_EXPIRE || '30d';
  
  return jwt.sign(payload, secret, { expiresIn: expiresIn as any });
};

// Verify Access Token
export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as TokenPayload;
};

// Verify Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  return jwt.verify(token, secret) as TokenPayload;
};

// Generate both tokens
export const generateTokens = (userId: string, email: string, role: string) => {
  const payload: TokenPayload = { id: userId, email, role };
  
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};