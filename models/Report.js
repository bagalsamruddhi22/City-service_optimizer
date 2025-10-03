// models/Report.js
module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: { 
      type: DataTypes.INTEGER, 
      primaryKey: true, 
      autoIncrement: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    type: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    image_url: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    // Use GEOMETRY type to match your current DB column type
    location: { 
      type: DataTypes.GEOMETRY('POINT', 4326), 
      allowNull: false,
    },
    status: { 
      type: DataTypes.ENUM('open', 'in_progress', 'resolved'), 
      defaultValue: 'open' 
    },
    created_at: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
  }, {
    tableName: 'reports',
    timestamps: true,
    underscored: true,
  });

  Report.associate = (models) => {
    Report.belongsTo(models.User, { foreignKey: 'user_id' });
    Report.hasMany(models.Comment, { foreignKey: 'report_id' });
  };

  return Report;
};
