const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  permissions: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  role_status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false, 
  tableName: 'roles', // Define the table name explicitly
});

module.exports = Role;




