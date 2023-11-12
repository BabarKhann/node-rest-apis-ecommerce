import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';

export default class JwtService {
  static sign(payload, expiry = '60s', secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
}
