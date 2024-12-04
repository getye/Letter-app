const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 


const Footer = sequelize.define('Footer', {
  footer_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pobox: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  slogan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'footers', // Explicitly define the table name 
});


module.exports = Footer;


