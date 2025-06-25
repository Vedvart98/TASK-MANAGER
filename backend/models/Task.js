const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');
const User = require('./User'); 
const Task = sequelize.define('Task',{
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Task title is required'
      },
      len: {
        args: [1, 255],
        msg: 'Task title must be between 1 and 255 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    defaultValue: 'To Do',
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Define associations
User.hasMany(Task,{
    foreignKey:'user_id',
    as:'tasks',
    onDelete:'CASCADE'
});
Task.belongsTo(User,{
    foreignKey:'user_id',
    as:'user'
});
module.exports = Task;