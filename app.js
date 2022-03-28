const express = require('express');
require('express-async-errors');

// Load env file
require('dotenv-flow').config();

// Get env variable
const { PORT, NODE_ENV } = process.env;

// Create Web API
const app = express();

// Add Middlewares
app.use(express.json());

// Initialize Database
const db = require('./models');
db.sequelize.authenticate()
    .then(() => console.log('Connection DB - OK'))
    .catch((error) => console.log('Connection DB - Error', error));

// Sync between models and database (Required DDL right)
if (NODE_ENV !== 'production') {
    // db.sequelize.sync();
}

// Add Routing
const router = require('./routes');
app.use('/api', router);

// Start Web API
app.listen(PORT, () => {
    console.log(`Web API up on port ${PORT}  [${NODE_ENV}]`);
});