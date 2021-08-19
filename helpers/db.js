const config = require('../config.json');

const postgres = require('pg-hstore');

const {Sequelize} = require('sequelize');


module.exports = db={};

setup();

async function setup(){
    const { host, port, user, password, database } = config.database;
     //await postgres.createConnection({ host, port, user, password });

    // connect to db
    const sequelize = new Sequelize(database, user, password, { dialect:'postgres'});
    db.Student = require('../service/user.model')(sequelize);
    
    // sync all models with database
    await sequelize.sync();
}   
