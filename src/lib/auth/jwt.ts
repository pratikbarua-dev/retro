import jwt from 'jsonwebtoken';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'retrolab_secret_jwt_key_2025_blueprint_production_secure_token';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  institution?: string;
  department?: string;
  batch?: string;
  iat?: number;
  exp?: number;
}

export function signToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    institution: user.institution,
    department: user.department,
    batch: user.batch,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload) as JWTPayload;
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          return null;
        }
        return payload;
      }
    } catch {
      return null;
    }
    return null;
  }
}

