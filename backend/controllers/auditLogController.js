import { Op } from 'sequelize';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

export const getAuditLogs = async (req, res) => {
  try {
    // 1. Lazy TTL cleanup: Delete logs where expires_at < now
    try {
      await AuditLog.destroy({
        where: {
          expires_at: {
            [Op.lt]: new Date()
          }
        }
      });
    } catch (err) {
      console.error('Lazy TTL cleanup failed:', err.message);
    }

    // 2. Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const offset = (page - 1) * limit;
    const { search, action } = req.query;

    const whereClause = {};

    // Action filter
    if (action && action !== 'ALL') {
      whereClause.action = action;
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchPattern = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { details: { [Op.iLike]: searchPattern } },
        { entity: { [Op.iLike]: searchPattern } },
        { '$user.username$': { [Op.iLike]: searchPattern } }
      ];
    }

    // 3. Find and count all audit logs
    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'userType']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.status(200).json({
      logs,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};
