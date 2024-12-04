const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 


const CC = sequelize.define('CC', {
  cc_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  ccs_name: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  ccs_email: {
    type: DataTypes.JSON,
    allowNull: true,
  },

}, {
  timestamps: false,
  tableName: 'ccs', // Explicitly define the table name 
});


module.exports = CC;


