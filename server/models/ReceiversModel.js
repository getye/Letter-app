const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 


const Receiver = sequelize.define('Receiver', {
  receiver_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  receiver_name: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  receiver_email: {
    type: DataTypes.JSON,
    allowNull: true,
  },

}, {
  timestamps: false,
  tableName: 'receivers', // Explicitly define the table name 
});


module.exports = Receiver;


