// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../db'); // Your updated db.js

// Import model factories
const UserModel = require('./User');
const ReportModel = require('./Report');
const EventModel = require('./Event');
const SuggestionModel = require('./Suggestion');
const CommentModel = require('./Comment');
const NotificationModel = require('./Notification');

// Initialize models with same sequelize instance
const User = UserModel(sequelize, Sequelize.DataTypes);
const Report = ReportModel(sequelize, Sequelize.DataTypes);
const Event = EventModel(sequelize, Sequelize.DataTypes);
const Suggestion = SuggestionModel(sequelize, Sequelize.DataTypes);
const Comment = CommentModel(sequelize, Sequelize.DataTypes);
const Notification = NotificationModel(sequelize, Sequelize.DataTypes);

// Object to hold models for association
const models = {
  User,
  Report,
  Event,
  Suggestion,
  Comment,
  Notification,
};

// Inject associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// Export models and sequelize instance
module.exports = {
  ...models,
  sequelize,
  Sequelize,
};
