import jwt from 'jsonwebtoken';
import RefreshToken from '../models/token.js';
import { config } from '../config/Config.js';

class JWTService {
  // sign access token 
  static signAccessToken(payload, expiryTime) {
    return jwt.sign(payload, config.ACCESS_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // sign refresh token
  static signRefreshToken(payload, expiryTime) {
    return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, { expiresIn: expiryTime });
  }

  // verify access token 
  static verifyAccessToken(token) {
    return jwt.verify(token, config.ACCESS_TOKEN_SECRET);
  }

  // verify refresh token 
  static verifyRefreshToken(token) {
    return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
  }

  // store refresh token
  static async storeRefreshToken(token, userId) {  // Added userId as a parameter
    try {
      const newToken = new RefreshToken({
        token: token,
        userId: userId
      });

      // store token
      await newToken.save();
    } catch (error) {
      console.log(error);
    }
  }
}

export default JWTService;
