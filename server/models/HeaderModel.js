const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 


const Header = sequelize.define('Header', {
  header_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  header_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  amharic_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  header_logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'headers', // Explicitly define the table name 
});


module.exports = Header;


