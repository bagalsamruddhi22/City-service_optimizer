// models/Suggestion.js
module.exports = (sequelize, DataTypes) => {
  const Suggestion = sequelize.define('Suggestion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    votes: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('open', 'closed'), defaultValue: 'open' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'suggestions',
    timestamps: true,
    underscored: true,
  });

  Suggestion.associate = (models) => {
    Suggestion.belongsTo(models.User, { foreignKey: 'user_id' });
    Suggestion.hasMany(models.Comment, { foreignKey: 'suggestion_id' });
  };

  return Suggestion;
};
