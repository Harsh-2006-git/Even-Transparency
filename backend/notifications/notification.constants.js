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
  // Candidate Notifications (Short, Professional & Compact)
  [NOTIFICATION_TYPES.CANDIDATE_REGISTRATION_OTP]: 'Even Cargo Verification OTP: {{otp}}',
  [NOTIFICATION_TYPES.CANDIDATE_JOB_APPLIED]: 'Application Received: {{job_title}}',
  [NOTIFICATION_TYPES.CANDIDATE_APPLICATION_SHORTLISTED]: 'Shortlisted: {{job_title}}',
  [NOTIFICATION_TYPES.CANDIDATE_INTERVIEW_SCHEDULED]: 'Interview Scheduled: {{job_title}}',
  [NOTIFICATION_TYPES.CANDIDATE_HIRED_CONTRACT]: 'Offer Issued: {{job_title}}',
  [NOTIFICATION_TYPES.CANDIDATE_ACTIVE_APPRENTICE]: 'Apprentice Onboarded: ID {{apprentice_id}}',
  [NOTIFICATION_TYPES.CANDIDATE_STIPEND_PROCESSED]: 'Stipend Processed: {{month}}',
  [NOTIFICATION_TYPES.CANDIDATE_GRIEVANCE_UPDATE]: 'Grievance Update #{{grievance_id}}',

  // Employer Notifications (Short, Professional & Compact)
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_SENT]: 'Registration Submission Received',
  [NOTIFICATION_TYPES.EMPLOYER_REGISTRATION_STATUS]: 'Employer Account Status: {{status}}',
  [NOTIFICATION_TYPES.EMPLOYER_JOB_POSTED]: 'Job Published: {{job_title}}',
  [NOTIFICATION_TYPES.EMPLOYER_APPLICATION_RECEIVED]: 'New Application: {{job_title}}',
  [NOTIFICATION_TYPES.EMPLOYER_INTERVIEW_SCHEDULED]: 'Interview Set: {{candidate_name}}',
  [NOTIFICATION_TYPES.EMPLOYER_CONTRACT_SIGNED]: 'Contract Signed: {{candidate_name}}',
  [NOTIFICATION_TYPES.EMPLOYER_STIPEND_PROCESSED]: 'Stipend Confirmation: {{month}}',
  [NOTIFICATION_TYPES.EMPLOYER_GRIEVANCE_ALERT]: 'Grievance Alert #{{grievance_id}}',

  // Admin Notifications (Short, Professional & Compact)
  [NOTIFICATION_TYPES.ADMIN_EMPLOYER_REGISTRATION_REQUEST]: 'Employer Approval Needed: {{company_name}}',
  [NOTIFICATION_TYPES.ADMIN_GRIEVANCE_ESCALATION]: 'Urgent Grievance Escalation #{{grievance_id}}',
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
