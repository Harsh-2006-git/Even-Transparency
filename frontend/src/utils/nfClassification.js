/**
 * Even Transparency — Candidate Lifecycle & Programme Transparency System
 * Official 3-Factor NF Classification Engine
 *
 * Factors:
 * 1. Driving Skill: 'No' | 'Basic' | 'Yes / Verified'
 * 2. Scooty Ownership/Access: 'No' | 'Yes'
 * 3. Driving Licence: 'No' | 'Yes'
 */

export const NF_CATEGORIES = {
  NF1: {
    code: 'NF1',
    label: 'NF1 — Fully Ready',
    shortLabel: 'NF1 (Fully Ready)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    hexColor: '#10B981',
    icon: '🟢',
    drivingSkill: 'Yes / Verified',
    scootyAccess: 'Yes',
    drivingLicence: 'Yes',
    summary: 'Knows how to ride a scooty, has/access to a scooty, and holds a valid driving licence.',
    intervention: 'She can proceed toward readiness, deployment eligibility and job matching.',
    recommendedModules: [
      '2W EV Riding & Safety Basics',
      'Advanced Defensive EV Driving',
      'Smartphone & Navigation Apps',
      'Customer Experience & Communication'
    ],
    readinessStatus: 'DEPLOYMENT_READY',
  },
  NF2: {
    code: 'NF2',
    label: 'NF2 — Moderate Support',
    shortLabel: 'NF2 (Moderate Support)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    hexColor: '#F59E0B',
    icon: '🟠',
    drivingSkill: 'Basic',
    scootyAccess: 'No',
    drivingLicence: 'No',
    summary: 'Has basic driving skills, does not have a scooty, does not have a driving licence.',
    intervention: 'Required intervention includes licence support, scooty access, practical driving reinforcement and verification.',
    recommendedModules: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Battery Swapping & Basic Maintenance',
      'Financial Literacy & Savings'
    ],
    readinessStatus: 'IN_PROGRESS',
  },
  NF3: {
    code: 'NF3',
    label: 'NF3 — Highest Support',
    shortLabel: 'NF3 (Highest Support)',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500',
    hexColor: '#F72570',
    icon: '🔴',
    drivingSkill: 'No',
    scootyAccess: 'No',
    drivingLicence: 'No',
    summary: 'Does not know how to ride a scooty, does not have a scooty, and does not have a driving licence.',
    intervention: 'Required intervention includes driving/mobility training, driving competency assessment, licence support and scooty access.',
    recommendedModules: [
      '2W EV Riding & Safety Basics',
      'Smartphone & Navigation Apps',
      'Financial Literacy & Savings',
      'Emergency Response & Road Safety'
    ],
    readinessStatus: 'NOT_STARTED',
  },
};

/**
 * Evaluates the 3 factors and returns the computed NF classification object
 * @param {string} drivingSkill - 'No' | 'Basic' | 'Yes / Verified'
 * @param {string} scootyAccess - 'No' | 'Yes'
 * @param {string} drivingLicence - 'No' | 'Yes'
 * @returns {object} NF Classification details (NF1, NF2, or NF3)
 */
export function evaluateNFClassification(drivingSkill = 'No', scootyAccess = 'No', drivingLicence = 'No') {
  const normSkill = String(drivingSkill || '').trim();
  const normScooty = String(scootyAccess || '').trim();
  const normLicence = String(drivingLicence || '').trim();

  // NF1 — Fully Ready (Yes / Verified, Yes, Yes)
  if (
    (normSkill.includes('Yes') || normSkill.includes('Verified')) &&
    normScooty === 'Yes' &&
    normLicence === 'Yes'
  ) {
    return NF_CATEGORIES.NF1;
  }

  // NF2 — Moderate Support (Basic driving skill, or lacks vehicle/license but has preliminary skill)
  if (
    normSkill === 'Basic' ||
    (normSkill.includes('Yes') && (normScooty === 'No' || normLicence === 'No'))
  ) {
    return NF_CATEGORIES.NF2;
  }

  // NF3 — Highest Support (No skill, No scooty, No licence)
  return NF_CATEGORIES.NF3;
}
