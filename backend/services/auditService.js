import db from '../models/index.js';

export const createAuditLog = async ({
  actorType = 'system',
  actorId = null,
  moduleName,
  entityType,
  entityId = null,
  actionType,
  oldValues = null,
  newValues = null,
  req = null
}) => {
  try {
    return await db.AdminAuditLog.create({
      actor_type: actorType,
      actor_id: actorId,
      module_name: moduleName,
      entity_type: entityType,
      entity_id: entityId,
      action_type: actionType,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req?.ip || req?.headers?.['x-forwarded-for'] || null,
      device_info: req?.headers?.['user-agent'] || null,
      action_timestamp: new Date()
    });
  } catch (error) {
    console.error('Audit log write failed:', error.message);
    return null;
  }
};
