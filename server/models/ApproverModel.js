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
    type: DataTypes.JSON,
    allowNull: true,
  },

  approvers_position: {
    type: DataTypes.JSON,
    allowNull: true,
  },

  approvers_segnature: {
    type: DataTypes.JSON,
    allowNull: false,
  },

}, {
  timestamps: false,
  tableName: 'approvers', // Explicitly define the table name 
});


module.exports = Approver;


