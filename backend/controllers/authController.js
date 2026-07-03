import db from '../models/index.js';
import { verifyRefreshToken, generateTokenPair } from '../services/tokenService.js';

export const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { valid, decoded, expired } = verifyRefreshToken(refreshToken);

    if (!valid) {
      return res.status(401).json({
        error: expired ? 'Refresh token has expired' : 'Invalid refresh token',
        code: expired ? 'REFRESH_TOKEN_EXPIRED' : 'INVALID_REFRESH_TOKEN'
      });
    }

    // Identify user and check status based on the token payload
    const { id, type } = decoded;

    if (!id || !type) {
      return res.status(401).json({ error: 'Invalid token payload structure' });
    }

    let userPayload = {};

    if (type === 'employer') {
      const user = await db.EmployerUser.findByPk(id, {
        include: [db.Employer]
      });

      if (!user) {
        return res.status(401).json({ error: 'User no longer exists' });
      }

      if (user.account_status === 'suspended') {
        return res.status(403).json({ error: 'Your account is suspended' });
      }

      userPayload = { id: user.id, email: user.email, type: 'employer' };
    } else if (type === 'candidate') {
      const candidate = await db.Candidate.findByPk(id);

      if (!candidate) {
        return res.status(401).json({ error: 'Candidate no longer exists' });
      }

      userPayload = { id: candidate.id, email: candidate.email, type: 'candidate' };
    } else if (type === 'admin') {
      const admin = await db.AdminUser.findByPk(id);

      if (!admin) {
        return res.status(401).json({ error: 'Admin no longer exists' });
      }

      if (admin.account_status && admin.account_status !== 'active') {
        return res.status(403).json({ error: 'This admin account is not active' });
      }

      userPayload = { id: admin.id, email: admin.email, type: 'admin' };
    } else {
      return res.status(400).json({ error: 'Unknown user type in token' });
    }

    // Generate new token pair
    const tokens = generateTokenPair(userPayload);

    return res.status(200).json({
      message: 'Token refreshed successfully',
      ...tokens
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
};
