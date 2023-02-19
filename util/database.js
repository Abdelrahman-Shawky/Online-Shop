const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(
    'online-shop',
    'root',
    'rootroot',
    {dialect: 'mysql',
    host: 'localhost',
    port: '3307'}
);

module.exports = sequelize;

