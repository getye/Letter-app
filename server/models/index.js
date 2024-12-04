// models/index.js
const sequelize = require('../dbcon'); // Sequelize instance
const User = require('./UserModel');
const Office = require('./OfficeModel');
const Account = require('./AccountModel');
const Role = require('./roleModel');
const Approver = require('./ApproverModel');
const CC = require('./CcsModel');
const Header = require('./HeaderModel');
const Letter = require('./LetterModel');
const Receiver = require('./ReceiversModel');
const Footer = require('./FooterModel');

const models = {
  User: User.init(sequelize),
  Office: Office.init(sequelize),
  Account: Account.init(sequelize),
  Role: Role.init(sequelize),
  Approver: Approver.init(sequelize),
  CC: CC.init(sequelize),
  Header: Header.init(sequelize),
  Letter: Letter.init(sequelize),
  Receiver: Receiver.init(sequelize),
  Footer: Footer.init(sequelize),
};

// Define associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models); // Pass all models to associate method
  }
});

module.exports = models;
