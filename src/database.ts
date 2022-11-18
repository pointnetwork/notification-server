import {Sequelize} from 'sequelize';

const database = new Sequelize({
    database: 'test',
    username: 'test',
    password: 'test1234',
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
    }
});

export default database;
