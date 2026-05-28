import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';

export const candidateAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type && decoded.type !== 'candidate') {
      return res.status(403).json({ error: 'Candidate access is required.' });
    }

    const candidate = await db.Candidate.findByPk(decoded.id);
    if (!candidate) {
      return res.status(401).json({ error: 'Candidate no longer exists.' });
    }

    req.candidate = candidate;
    req.user = {
      id: candidate.id,
      email: candidate.email,
      role: 'candidate',
      userType: 'Candidate'
    };
    next();
  } catch (error) {
    console.error('Candidate auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
