// models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: true },
    location: { type: DataTypes.GEOMETRY('POINT'), allowNull: false },
    // created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'events',
    timestamps: true,
    underscored: true,
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, { foreignKey: 'created_by' });
  };

  return Event;
};
