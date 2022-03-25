const Sequelize = require('sequelize');

// Sequelize Initialization
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD,
    {
        host: process.env.DB_SERVER,
        port: process.env.DB_PORT,
        dialect: 'mssql',
        pool: {
            min: 0,
            max: 5,
            idle: 10_000,
            acquire: 30_000
        }
    }
);

// Create object DB
const db = {};

// Add instance of Sequelize
db.sequelize = sequelize;

// Add Models
db.Category = require('./category')(sequelize);
db.Message = require('./message')(sequelize);
db.Subject = require('./subject')(sequelize);

// Add Association
db.Subject.hasMany(db.Message, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' });
db.Message.belongsTo(db.Subject);

// Export object DB
module.exports = db;