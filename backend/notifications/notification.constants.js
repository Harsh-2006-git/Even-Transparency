export const NOTIFICATION_TYPES = {
  // Candidate Notifications (8)
  CANDIDATE_REGISTRATION_OTP: 'candidate.registration.otp',
  CANDIDATE_JOB_APPLIED: 'candidate.job.applied',
  CANDIDATE_APPLICATION_SHORTLISTED: 'candidate.application.shortlisted',
  CANDIDATE_INTERVIEW_SCHEDULED: 'candidate.interview.scheduled',
  CANDIDATE_HIRED_CONTRACT: 'candidate.hired.contract',
  CANDIDATE_ACTIVE_APPRENTICE: 'candidate.active.apprentice',
  CANDIDATE_STIPEND_PROCESSED: 'candidate.stipend.processed',
  CANDIDATE_GRIEVANCE_UPDATE: 'candidate.grievance.update',

  // Employer Notifications (8)
  EMPLOYER_REGISTRATION_SENT: 'employer.registration.sent',
  EMPLOYER_REGISTRATION_STATUS: 'employer.registration.status',
  EMPLOYER_JOB_POSTED: 'employer.job.posted',
  EMPLOYER_APPLICATION_RECEIVED: 'employer.application.received',
  EMPLOYER_INTERVIEW_SCHEDULED: 'employer.interview.scheduled',
  EMPLOYER_CONTRACT_SIGNED: 'employer.contract.signed',
  EMPLOYER_STIPEND_PROCESSED: 'employer.stipend.processed',
  EMPLOYER_GRIEVANCE_ALERT: 'employer.grievance.alert',

  // Admin Notifications (2)
  ADMIN_EMPLOYER_REGISTRATION_REQUEST: 'admin.employer.registration_request',
  ADMIN_GRIEVANCE_ESCALATION: 'admin.grievance.escalation',
};

export const NOTIFICATION_SUBJECTS = {
  // Candidate
  [NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP]: 'Welcome to the Apprenticeship Portal – Your OTP for Account Verification',
  [NOTIFICATION_TYPES.CANDIDATE_JOB_APPLIED]: 'Application Received: {{job_title}} at {{company_name}}',
  [NOTIFICATION_TYPES.CANDIDATE_APPLICATION_SHORTLISTED]: "Great News! You've been shortlisted for {{job_title}}",
  [NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED]: 'Interview Scheduled: {{job_title}} with {{company_name}}',
  [NOTIFICATION_TYPES.CANDIDATE_HIRED_CONTRACT]: 'Congratulations! You have been selected for {{job_title}}',
  [NOTIFICATION_TYPES.CANDIDATE_ACTIVE_APPRENTICE]: 'Apprentice Onboarding Complete – Apprentice ID: {{apprentice_id}}',
  [NOTIFICATION_TYPES.CANDIDATE_STIPEND_PROCESSED]: 'Stipend Update for {{month}}',
  [NOTIFICATION_TYPES.CANDIDATE_GRIEVANCE_UPDATE]: 'Grievance Update - Case #{{grievance_id}}',

  // Employer
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_SENT]: 'Registration Submission Received - Even Cargo Apprenticeship Portal',
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_STATUS]: 'Employer Account Status Update: {{status}}',
  [NOTIFICATION_TYPES.EMPLOYER_JOB_POSTED]: 'Job Posting Confirmation: {{job_title}}',
  [NOTIFICATION_TYPES.EMPLOYER_APPLICATION_RECEIVED]: 'New Candidate Application for {{job_title}}',
  [NOTIFICATION_TYPES.EMPLOYER_INTERVIEW_SCHEDULED]: 'Interview Scheduled with {{candidate_name}} for {{job_title}}',
  [NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED]: 'Apprenticeship Contract Signed by {{candidate_name}}',
  [NOTIFICATION_TYPES.EMPLOYER_STIPEND_PROCESSED]: 'Stipend Processing Confirmation for {{month}}',
  [NOTIFICATION_TYPES.EMPLOYER_GRIEVANCE_ALERT]: 'URGENT: Grievance Alert - Case #{{grievance_id}}',

  // Admin
  [NOTIFICATION_TYPES.ADMIN_EMPLOYER_REGISTRATION_REQUEST]: 'New Employer Registration Pending Approval: {{company_name}}',
  [NOTIFICATION_TYPES.ADMIN_GRIEVANCE_ESCALATION]: 'CRITICAL: Safety/Harassment Grievance Reported - Case #{{grievance_id}}',
};

export const TEMPLATE_MAPPING = {
  [NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP]: 'candidate/registration_otp',
  [NOTIFICATION_TYPES.CANDIDATE_JOB_APPLIED]: 'candidate/job_applied',
  [NOTIFICATION_TYPES.CANDIDATE_APPLICATION_SHORTLISTED]: 'candidate/application_shortlisted',
  [NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED]: 'candidate/interview_scheduled',
  [NOTIFICATION_TYPES.CANDIDATE_HIRED_CONTRACT]: 'candidate/hired_contract',
  [NOTIFICATION_TYPES.CANDIDATE_ACTIVE_APPRENTICE]: 'candidate/active_apprentice',
  [NOTIFICATION_TYPES.CANDIDATE_STIPEND_PROCESSED]: 'candidate/stipend_processed',
  [NOTIFICATION_TYPES.CANDIDATE_GRIEVANCE_UPDATE]: 'candidate/grievance_update',

  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_SENT]: 'employer/registration_sent',
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_STATUS]: 'employer/registration_status',
  [NOTIFICATION_TYPES.EMPLOYER_JOB_POSTED]: 'employer/job_posted',
  [NOTIFICATION_TYPES.EMPLOYER_APPLICATION_RECEIVED]: 'employer/application_received',
  [NOTIFICATION_TYPES.EMPLOYER_INTERVIEW_SCHEDULED]: 'employer/interview_scheduled',
  [NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED]: 'employer/contract_signed',
  [NOTIFICATION_TYPES.EMPLOYER_STIPEND_PROCESSED]: 'employer/stipend_processed',
  [NOTIFICATION_TYPES.EMPLOYER_GRIEVANCE_ALERT]: 'employer/grievance_alert',

  [NOTIFICATION_TYPES.ADMIN_EMPLOYER_REGISTRATION_REQUEST]: 'admin/employer_registration_request',
  [NOTIFICATION_TYPES.ADMIN_GRIEVANCE_ESCALATION]: 'admin/grievance_escalation',
};
