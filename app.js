/**
* app.js
* 
* @description:: This is the entry point for the app/server
*
*/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes');
const { handleError } = require('./utils/error.js');

const app = express();

// set cors
app.use(
  cors({
    origin: ['https://vsnandy.github.io', 'http://localhost:3000', 'http://localhost:8000', 'http://localhost:8001'],
    credentials: true,
    exposedHeaders: ["set-cookie"]
  })
);

// Middleware that transforms the raw string of req.body into json
app.use(bodyParser.json());

dotenv.config();

// set the port
const port = process.env.PORT || 3000;

// send a message to '/'
app.get('/', (req, res) => res.send('API details coming soon!'));

// setup api endpoints for use by app server
app.use('/api/v1', routes);

// middleware to handle errors
app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, () => {
  console.log('App is running on http://localhost:' + port);
});
