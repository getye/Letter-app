const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 


const Approver = sequelize.define('Approver', {
  approver_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  approvers_name: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  approvers_position: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  approvers_segnature: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

}, {
  timestamps: false,
  tableName: 'approvers', // Explicitly define the table name 
});


module.exports = Approver;


