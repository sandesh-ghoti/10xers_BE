import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/serverConfig';

export function signjwt(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${JWT_EXPIRES_IN}h` });
}

export function verifyjwt(token: string): boolean {
  if (jwt.verify(token, JWT_SECRET)) {
    return true;
  }
  return false;
}

export function getPayload(token: string) {
  const payload = jwt.verify(token, JWT_SECRET);
  return payload;
}
