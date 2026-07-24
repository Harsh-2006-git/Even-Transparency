export default (sequelize, DataTypes) => {
  const NotificationPreference = sequelize.define('NotificationPreference', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    applicationEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    interviewEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stipendEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    grievanceEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    reminderEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    marketingEmails: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'notificationpreferences',
    timestamps: true,
  });

  return NotificationPreference;
};
