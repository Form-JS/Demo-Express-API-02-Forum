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

// TODO Initialize Database
// ...

// TODO Add Routing
// ...

// Start Web API
app.listen(PORT, () => {
    console.log(`Web API up on port ${PORT}  [${NODE_ENV}]`);
});