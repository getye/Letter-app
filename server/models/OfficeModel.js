const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 
const User = require('./UserModel');



const Office = sequelize.define('Office', {
  office_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  office_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  writer: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: User, // User table
      key: 'user_id',
    },
  },
  head: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: User, // User table
      key: 'user_id',
    },
  },
  manager: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: User, // User table
      key: 'user_id',
    },
  },  
  executive: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: User, // User table
      key: 'user_id',
    },
  },  
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'offices', // Explicitly define the table name 
});

// Define associations
Office.belongsTo(User, { foreignKey: 'writer', targetKey: 'user_id', as: 'Writer' });
Office.belongsTo(User, { foreignKey: 'head', targetKey: 'user_id', as:'Head' });
Office.belongsTo(User, { foreignKey: 'manager', targetKey: 'user_id', as:'Manager' });
Office.belongsTo(User, { foreignKey: 'executive', targetKey: 'user_id', as:'Executive' });


module.exports = Office;


