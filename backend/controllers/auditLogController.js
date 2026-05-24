import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';

export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'userType']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 100
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs', error: error.message });
  }
};
