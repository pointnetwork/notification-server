import {Sequelize} from 'sequelize';

const database = new Sequelize({
    database: 'test',
    username: 'test',
    password: 'test1234',
    dialect: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
    dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
    }
});

export default database;
