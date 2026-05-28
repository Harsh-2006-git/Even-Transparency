import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.EmployerUser.findByPk(decoded.id, {
      include: [db.Employer]
    });

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    if (user.account_status === 'suspended') {
      return res.status(403).json({ error: 'Your account is suspended' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
