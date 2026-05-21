import User from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
  const adminId = req.headers['x-admin-id'];

  if (!adminId) {
    return res.status(401).json({ error: 'Authentication required. Admin ID missing in headers.' });
  }

  try {
    const admin = await User.findByPk(adminId);
    if (!admin || admin.userType !== 'Admin') {
      return res.status(403).json({ error: 'Access denied. Only administrators can perform this action.' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(505).json({ error: 'Authorization check failed.', message: error.message });
  }
};
