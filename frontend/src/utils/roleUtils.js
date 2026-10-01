/**
 * Normalizes any role or userType string into one of 5 standard application roles:
 * - 'Admin' (matches Super Admin, super_admin, org_admin, admin, Administrator, etc.)
 * - 'Mobilizer' (matches Field Mobilizer, mobilizer, Mobilizer, etc.)
 * - 'Trainer' (matches Trainer, trainer, Assessor, etc.)
 * - 'PlacementCoordinator' (matches Placement Coordinator, placement_coordinator, etc.)
 * - 'Candidate' (matches Candidate, candidate, etc.)
 */
export const normalizeRole = (roleOrType) => {
  if (!roleOrType) return 'Admin';
  const clean = String(roleOrType).toLowerCase().trim().replace(/[\s_-]+/g, '');
  if (clean.includes('admin') || clean === 'superadmin' || clean === 'orgadmin') return 'Admin';
  if (clean.includes('mobiliz')) return 'Mobilizer';
  if (clean.includes('train')) return 'Trainer';
  if (clean.includes('placement') || clean.includes('coord')) return 'PlacementCoordinator';
  if (clean.includes('cand')) return 'Candidate';
  return 'Admin';
};

export const isSuperAdminRole = (roleOrType) => {
  return normalizeRole(roleOrType) === 'Admin';
};
