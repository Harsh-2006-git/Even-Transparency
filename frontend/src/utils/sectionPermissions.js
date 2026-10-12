import { normalizeRole } from './roleUtils.js';

/**
 * Maps each route/section ID to the normalized roles permitted to access it.
 * Standard Normalized Roles:
 * - 'Admin'
 * - 'Trainer'
 * - 'Mobilizer'
 * - 'PlacementCoordinator'
 * - 'Candidate'
 */
export const SECTION_PERMISSIONS = {
  // Common Dashboards (rendered per role)
  'overview': ['Admin', 'Mobilizer', 'Trainer', 'PlacementCoordinator'],
  'dashboard': ['Candidate', 'Admin'],

  // Super Admin Management Only
  'user-management': ['Admin'],
  'mobilizers': ['Admin'],
  'trainers': ['Admin'],
  'placement-coordinators': ['Admin'],
  'partners': ['Admin'],
  'kyc': ['Admin'],
  'audit-logs': ['Admin'],
  'retention': ['Admin'],
  'impact': ['Admin'],
  'analytics': ['Admin'],
  'organizations': ['Admin'],
  'system-master': ['Admin'],
  'training-centres': ['Admin'],
  'certifications': ['Admin'],
  'batch-create': ['Admin'],
  'create-batch': ['Admin'],

  // Field Mobilizer (and Super Admin)
  'onboard-candidate': ['Mobilizer', 'Admin'],
  'candidate-onboarding': ['Mobilizer', 'Admin'],
  'readiness': ['Mobilizer', 'Admin'],
  'assessments-placements': ['Mobilizer', 'Admin'],
  'targets': ['Mobilizer', 'Admin'],
  'goals': ['Mobilizer', 'Admin'],

  // Candidates & Documents (Mobilizer, Admin, or Trainer for assigned candidates)
  'candidates': ['Admin', 'Mobilizer', 'Trainer'],
  'documents': ['Candidate', 'Mobilizer', 'Admin'],
  'document-verification': ['Admin', 'Mobilizer'],

  // Training Operations (Trainer & Admin)
  'training': ['Admin', 'Trainer', 'Candidate'],
  'batches': ['Admin', 'Trainer'],
  'training-batches': ['Admin', 'Trainer'],
  'training-modules': ['Admin', 'Trainer'],
  'attendance': ['Admin', 'Trainer', 'Candidate'],
  'assessments': ['Admin', 'Trainer', 'Candidate'],
  'batch-calendar': ['Trainer', 'Admin'],
  'calendar': ['Trainer', 'Admin'],
  'timetable': ['Trainer', 'Admin'],
  'practical-sessions': ['Trainer', 'Admin'],
  'feedback': ['Trainer', 'Admin'],
  'trainer-feedback': ['Trainer', 'Admin'],
  'reports': ['Trainer', 'Admin'],
  'trainer-reports': ['Trainer', 'Admin'],
  'trainer-support': ['Trainer', 'Admin'],

  // Placement Management (PlacementCoordinator & Admin)
  'employers': ['PlacementCoordinator', 'Admin'],
  'openings': ['PlacementCoordinator', 'Admin'],
  'job-opportunities': ['PlacementCoordinator', 'Admin'],
  'applications': ['PlacementCoordinator', 'Admin'],
  'interviews': ['PlacementCoordinator', 'Admin'],
  'deployments': ['PlacementCoordinator', 'Admin'],
  'placements': ['PlacementCoordinator', 'Admin'],
  'employment-tracking': ['PlacementCoordinator', 'Admin'],

  // Candidate Portal Exclusives
  'profile': ['Candidate'],
  'nf-status': ['Candidate'],
  'my-batch': ['Candidate'],
  'training-progress': ['Candidate'],
  'offers': ['Candidate'],
  'job-offers': ['Candidate'],
  'support': ['Candidate', 'Trainer'],
  'notifications': ['Candidate', 'Admin', 'Mobilizer', 'Trainer', 'PlacementCoordinator'],
  'settings': ['Admin', 'Candidate', 'Mobilizer', 'Trainer', 'PlacementCoordinator'],
};

/**
 * Checks whether a given user role is authorized to view a section.
 * Returns { authorized: boolean, allowedRoles: string[] }
 */
export const checkSectionAuthorization = (userRole, sectionId) => {
  const normalizedUserRole = normalizeRole(userRole);
  if (!sectionId) return { authorized: true, allowedRoles: [] };

  const cleanSection = sectionId.toLowerCase().trim();

  // If section not found in rules, default to Super Admin only
  const allowedRoles = SECTION_PERMISSIONS[cleanSection] || ['Admin'];

  const authorized = allowedRoles.includes(normalizedUserRole);

  return {
    authorized,
    allowedRoles,
    normalizedUserRole
  };
};
