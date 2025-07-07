import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-for-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateTokens = (user: UserPayload): AuthTokens => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
  } catch (error) {
    console.error('Access token verification failed:', error);
    return null;
  }
};

export const verifyRefreshToken = (token: string): { id: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    if (decoded.type !== 'refresh') {
      return null;
    }
    return { id: decoded.id };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

export const requireAuth = (authHeader: string | undefined): UserPayload => {
  const token = extractTokenFromHeader(authHeader);
  if (!token) {
    throw new Error('No token provided');
  }

  const user = verifyAccessToken(token);
  if (!user) {
    throw new Error('Invalid or expired token');
  }

  return user;
};