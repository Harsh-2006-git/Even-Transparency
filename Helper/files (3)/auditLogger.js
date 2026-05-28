const { AuditLog } = require('../models');
const logger = require('../utils/logger');

/**
 * createAuditLog — write an audit entry
 * Called manually from controllers for key actions
 */
const createAuditLog = async ({
  actorUserId,
  actorRole,
  action,
  entityType,
  entityId,
  description,
  previousValue,
  newValue,
  req,
}) => {
  try {
    await AuditLog.create({
      actorUserId,
      actorRole,
      action,
      entityType,
      entityId,
      description,
      previousValue,
      newValue,
      ipAddress: req?.ip || req?.headers?.['x-forwarded-for'],
      userAgent: req?.headers?.['user-agent'],
      requestId: req?.headers?.['x-request-id'],
    });
  } catch (error) {
    // Audit log failure must not break the main request
    logger.error(`Audit log write failed: ${error.message}`);
  }
};

/**
 * auditMiddleware — auto-logs uploads, profile edits, approvals, payments
 * Attach as route-level middleware after protect
 * Usage: router.post('/verify', protect, auditMiddleware('document.verified', 'CandidateDocument'), handler)
 */
const auditMiddleware = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method so we can intercept the response
    const originalJson = res.json.bind(res);

    res.json = async function (body) {
      if (body?.success && req.user) {
        const entityId = body?.data?._id || req.params?.id;
        if (entityId) {
          await createAuditLog({
            actorUserId: req.user.userId,
            actorRole: req.user.role,
            action,
            entityType,
            entityId,
            description: `${action} by ${req.user.role} ${req.user.userId}`,
            req,
          });
        }
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = { createAuditLog, auditMiddleware };
