import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Candidate extends Model {
    static associate(models) {
      if (models.Organization) {
        Candidate.belongsTo(models.Organization, { foreignKey: 'organization_id', as: 'organization' });
      }
      if (models.Partner) {
        Candidate.belongsTo(models.Partner, { foreignKey: 'partner_id', as: 'partner' });
        Candidate.belongsTo(models.Partner, { foreignKey: 'assigned_partner_id', as: 'assignedPartner' });
      }
      if (models.User) {
        Candidate.belongsTo(models.User, { foreignKey: 'mobilizer_id', as: 'mobilizer' });
        Candidate.belongsTo(models.User, { foreignKey: 'assigned_mobilizer_id', as: 'assignedMobilizerUser' });
        Candidate.belongsTo(models.User, { foreignKey: 'trainer_id', as: 'trainer' });
        Candidate.belongsTo(models.User, { foreignKey: 'assigned_trainer_id', as: 'assignedTrainerUser' });
        Candidate.belongsTo(models.User, { foreignKey: 'placement_coordinator_id', as: 'placementCoordinator' });
        Candidate.belongsTo(models.User, { foreignKey: 'assigned_placement_coordinator_id', as: 'assignedPlacementCoordinatorUser' });
      }
      if (models.Mobilizer) {
        Candidate.belongsTo(models.Mobilizer, { foreignKey: 'assigned_mobilizer_id', as: 'assignedMobilizer' });
      }
      if (models.Trainer) {
        Candidate.belongsTo(models.Trainer, { foreignKey: 'assigned_trainer_id', as: 'assignedTrainer' });
      }
      if (models.PlacementCoordinator) {
        Candidate.belongsTo(models.PlacementCoordinator, { foreignKey: 'assigned_placement_coordinator_id', as: 'assignedPlacementCoordinator' });
      }
      if (models.TrainingCenter) {
        Candidate.belongsTo(models.TrainingCenter, { foreignKey: 'training_center_id', as: 'trainingCenter' });
      }
      if (models.CandidateDocument) {
        Candidate.hasMany(models.CandidateDocument, { foreignKey: 'candidate_id', as: 'documents' });
      }
      if (models.CandidateReadiness) {
        Candidate.hasOne(models.CandidateReadiness, { foreignKey: 'candidate_id', as: 'readinessProfile' });
      }
      if (models.CandidateStageHistory) {
        Candidate.hasMany(models.CandidateStageHistory, { foreignKey: 'candidate_id', as: 'stageHistory' });
      }
      if (models.CandidateRiskFlag) {
        Candidate.hasMany(models.CandidateRiskFlag, { foreignKey: 'candidate_id', as: 'riskFlags' });
      }
      if (models.MobilizationRecord) {
        Candidate.hasOne(models.MobilizationRecord, { foreignKey: 'candidate_id', as: 'mobilization' });
      }
      if (models.NFClassification) {
        Candidate.hasMany(models.NFClassification, { foreignKey: 'candidate_id', as: 'nfClassifications' });
      }
      if (models.TrainingRecommendation) {
        Candidate.hasMany(models.TrainingRecommendation, { foreignKey: 'candidate_id', as: 'trainingRecommendations' });
      }
      if (models.BatchEnrollment) {
        Candidate.hasMany(models.BatchEnrollment, { foreignKey: 'candidate_id', as: 'enrollments' });
      }
      if (models.TrainingAttendance) {
        Candidate.hasMany(models.TrainingAttendance, { foreignKey: 'candidate_id', as: 'attendances' });
      }
      if (models.TrainingAssessment) {
        Candidate.hasMany(models.TrainingAssessment, { foreignKey: 'candidate_id', as: 'assessments' });
      }
      if (models.TrainerFeedback) {
        Candidate.hasMany(models.TrainerFeedback, { foreignKey: 'candidate_id', as: 'feedbacks' });
      }
      if (models.TrainerObservation) {
        Candidate.hasMany(models.TrainerObservation, { foreignKey: 'candidate_id', as: 'observations' });
      }
      if (models.CandidateCertification) {
        Candidate.hasMany(models.CandidateCertification, { foreignKey: 'candidate_id', as: 'certifications' });
      }
      if (models.ReadinessAssessment) {
        Candidate.hasMany(models.ReadinessAssessment, { foreignKey: 'candidate_id', as: 'readinessAssessments' });
      }
      if (models.CandidateDeployment) {
        Candidate.hasMany(models.CandidateDeployment, { foreignKey: 'candidate_id', as: 'deployments' });
      }
      if (models.EmploymentRecord) {
        Candidate.hasMany(models.EmploymentRecord, { foreignKey: 'candidate_id', as: 'employmentRecords' });
      }
      if (models.EmploymentTracking) {
        Candidate.hasMany(models.EmploymentTracking, { foreignKey: 'candidate_id', as: 'employmentTrackings' });
      }
      if (models.RetentionTracking) {
        Candidate.hasMany(models.RetentionTracking, { foreignKey: 'candidate_id', as: 'retentionTrackings' });
      }
      if (models.RetentionMilestone) {
        Candidate.hasMany(models.RetentionMilestone, { foreignKey: 'candidate_id', as: 'retentionMilestones' });
      }
      if (models.PerformanceFeedback) {
        Candidate.hasMany(models.PerformanceFeedback, { foreignKey: 'candidate_id', as: 'performanceFeedbacks' });
      }
      if (models.SafetyIncident) {
        Candidate.hasMany(models.SafetyIncident, { foreignKey: 'candidate_id', as: 'safetyIncidents' });
      }
      if (models.EmploymentExit) {
        Candidate.hasMany(models.EmploymentExit, { foreignKey: 'candidate_id', as: 'exits' });
      }
    }
  }

  Candidate.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidate_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // e.g. ET-000123
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    middle_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternate_mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: 'Female',
    },
    marital_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address_line_1: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address_line_2: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    education_level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employment_status: {
      type: DataTypes.STRING,
      defaultValue: 'Unemployed',
    },
    current_employment_status: {
      type: DataTypes.STRING,
      defaultValue: 'Unemployed',
    },

    // ─── Lifecycle Stages ──────────────────────────────────────────────────
    current_stage: {
      type: DataTypes.ENUM(
        'MOBILIZED',
        'REGISTERED',
        'ASSESSED',
        'NF_CLASSIFIED',
        'TRAINING_RECOMMENDED',
        'IN_TRAINING',
        'READINESS_ASSESSMENT',
        'DEPLOYMENT_READY',
        'DEPLOYED',
        'EMPLOYED',
        'RETENTION_MONITORING',
        'EXITED',
        'MOBILIZATION',
        'REGISTRATION',
        'NF_CLASSIFICATION',
        'TRAINING_RECOMMENDATION',
        'TRAINING',
        'READINESS',
        'DEPLOYMENT',
        'EMPLOYMENT',
        'RETENTION_IMPACT',
        'DROPPED',
        'HOLD'
      ),
      defaultValue: 'MOBILIZED',
      allowNull: false,
    },

    // ─── NF Category & Training Recommendation ─────────────────────────────
    nf_category: {
      type: DataTypes.ENUM('NF1', 'NF2', 'NF3', 'UNCLASSIFIED'),
      defaultValue: 'UNCLASSIFIED',
    },
    nf_classification_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    nf_classified_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    recommended_trainings: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    // ─── Key Assignments ───────────────────────────────────────────────────
    organization_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    training_center_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    mobilizer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_mobilizer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    trainer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_trainer_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    placement_coordinator_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    assigned_placement_coordinator_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    // ─── Progress & Aggregate Metrics ──────────────────────────────────────
    training_progress_percentage: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    overall_attendance_rate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    readiness_score: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    readiness_status: {
      type: DataTypes.ENUM(
        'NOT_EVALUATED',
        'DEPLOYMENT_READY',
        'NEEDS_ADDITIONAL_TRAINING',
        'HOLD',
        'PENDING_DOCUMENTS',
        'NOT_ELIGIBLE',
        'Deployment Ready',
        'Needs Additional Training',
        'Hold',
        'Pending Documents',
        'Not Eligible'
      ),
      defaultValue: 'NOT_EVALUATED',
    },
    deployment_status: {
      type: DataTypes.ENUM(
        'NOT_DEPLOYED',
        'IN_PIPELINE',
        'OFFERED',
        'DEPLOYED',
        'ON_HOLD',
        'Joined',
        'Pending'
      ),
      defaultValue: 'NOT_DEPLOYED',
    },

    // ─── Risk Engine ───────────────────────────────────────────────────────
    risk_level: {
      type: DataTypes.ENUM('NORMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'Normal', 'Low', 'Medium', 'High', 'Critical'),
      defaultValue: 'NORMAL',
    },
    risk_reasons: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    risk_updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    // ─── Activity & Status ─────────────────────────────────────────────────
    last_activity_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    registered_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived', 'Active', 'Inactive', 'Archived'),
      defaultValue: 'active',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Candidate',
    tableName: 'portal_candidates',
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ['candidate_code'] },
      { fields: ['current_stage'] },
      { fields: ['nf_category'] },
      { fields: ['risk_level'] },
      { fields: ['city'] },
      { fields: ['partner_id'] },
      { fields: ['organization_id'] },
      { fields: ['mobilizer_id'] },
      { fields: ['trainer_id'] },
    ],
  });

  return Candidate;
};
