/**
 * auditHelper.js
 *
 * Central utility for creating AuditLog records and broadcasting them
 * to all connected Socket.io admin clients in real-time.
 */
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import { getIO } from './socket.js';

/**
 * Creates an AuditLog entry and emits it via Socket.io.
 *
 * @param {{ userId, action, entity, entityId, details }} params
 */
export const createAuditLog = async ({ userId, action, entity, entityId, details }) => {
  try {
    const log = await AuditLog.create({ userId, action, entity, entityId, details });
    const plainLog = log.toJSON(); // Ensures all fields including created_at are present

    // Fetch the associated user for the real-time payload
    let userPayload = null;
    if (userId) {
      const user = await User.findByPk(userId, { attributes: ['username', 'email', 'userType'] });
      if (user) {
        userPayload = { username: user.username, email: user.email, userType: user.userType };
      }
    }

    // Emit real-time event to all connected Socket.io clients
    const io = getIO();
    if (io) {
      const payload = {
        id: plainLog.id,
        action: plainLog.action,
        entity: plainLog.entity,
        entityId: plainLog.entityId,
        details: plainLog.details,
        created_at: plainLog.created_at || new Date().toISOString(),
        user: userPayload
      };
      io.emit('audit:new', payload);
      console.log(`[Socket.io] Emitted audit:new → action=${payload.action} entity=${payload.entity}`);
    } else {
      console.warn('[Socket.io] io is null – audit:new NOT emitted');
    }

    return log;
  } catch (err) {
    console.error('[AuditLog] Failed to create or emit audit log:', err.message);
  }
};
