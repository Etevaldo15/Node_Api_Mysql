const config = require('config.json');
const mysql = require('mysql2/promise');
const Sequelize  = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // criar base de dados caso não existir no sgbd
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // conectar com banco de dados
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' },{ dialectModule: require('mysql2')},);

    // inicializar as models e adicionar então o objecto exportado do banco de dados
    db.User = require('../users/user.model')(sequelize);

    // sincronizar todos as models com banco de dados
    await sequelize.sync();
}