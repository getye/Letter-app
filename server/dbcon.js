const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('qmt', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // Specifies the database type
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected via Sequelize');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
