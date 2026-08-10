export default (sequelize, DataTypes) => {
  const EmailLog = sequelize.define('EmailLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    recipient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'QUEUED',
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'MEDIUM', // HIGH, MEDIUM, LOW
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    retries: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'emaillogs',
    timestamps: true,
  });

  return EmailLog;
};
