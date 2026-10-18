import jwt from 'jsonwebtoken';
import { store } from '../store/dataStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jeevan_raksha_emergency_super_secret_key_2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
    }

    const user = store.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found in system.' });
    }

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };
    next();
  });
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. This action requires one of the following roles: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};
