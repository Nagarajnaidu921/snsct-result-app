'use strict';

// Load Envirionment Variables From .env File;
require('dotenv').config();

const config = require('config');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = config.PORT;

/**
 * Initializing DB connection
 */
require('./app/models');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
require('./app/routes')(app);

app.listen(PORT, () => console.log('Server Is Up And Running On Port %d', PORT));
