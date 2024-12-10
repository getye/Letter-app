const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 
const Account = require('../models/AccountModel'); 
const Role = require('../models/roleModel');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  user_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_role: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Role, 
      key: 'role_name',
    },
  },
  user_profile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'users', // Explicitly define the table name 
});

// Define Association
User.hasOne(Account, { foreignKey: 'user_id' });
Account.belongsTo(User, { foreignKey: 'user_id' });

User.belongsTo(Role, { foreignKey: 'user_role', targetKey: 'role_name' });

 

module.exports = User;



