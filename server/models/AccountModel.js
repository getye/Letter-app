const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 

const Account = sequelize.define('Account', {
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true, 
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, 
  tableName: 'accounts', // Specify the table name explicitly
});



module.exports = Account;
