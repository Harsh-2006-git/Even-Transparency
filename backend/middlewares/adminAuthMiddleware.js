import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'even_cargo_secret_key';

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.type !== 'admin') {
      return res.status(403).json({ error: 'Admin access is required.' });
    }

    req.user = decoded; // Contains id, email, type
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};
