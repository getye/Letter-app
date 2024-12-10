const { DataTypes } = require('sequelize');
const { sequelize } = require('../dbcon'); 
const Header = require('./HeaderModel');
const User = require('./UserModel');
const Receiver = require('./ReceiversModel');
const CC = require('./CcsModel');
const Approver = require('./ApproverModel');
const Footer = require('./FooterModel');
const Office = require('./OfficeModel');

const Letter = sequelize.define('Letter', {
  ref_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  header_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Header, 
      key: 'header_id',
    },
  },

  writer_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User, 
      key: 'user_id',
    },
  },

  receiver_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Receiver, 
      key: 'receiver_id',
    },
  },

  subject: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  cc_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: CC, 
      key: 'cc_id',
    },
  },

  approvers_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Approver, 
      key: 'approver_id',
    },
  },

  footer_id: {
    type: DataTypes.STRING,
    allowNull: true,
    references: {
      model: Footer, 
      key: 'footer_id',
    },
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: false,
  tableName: 'letters', // Explicitly define the table name 
});

// Define associations
Letter.belongsTo(Header, { foreignKey: 'header_id', as: 'header' });
Letter.belongsTo(User, { foreignKey: 'writer_id', as: 'writer' });
Letter.belongsTo(Receiver, { foreignKey: 'receiver_id', as: 'receiver' });
Letter.belongsTo(CC, { foreignKey: 'cc_id', as: 'cc' });
Letter.belongsTo(Approver, { foreignKey: 'approvers_id', as: 'approver' });
Letter.belongsTo(Footer, { foreignKey: 'footer_id', as: 'footer' });
Letter.belongsTo(Office, { foreignKey: 'writer_id', targetKey: 'writer', as:"office" });

module.exports = Letter;



