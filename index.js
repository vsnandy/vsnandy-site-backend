const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const football = require('./routes/football');

const app = express();

// set cors
app.use(cors({
  origin: ['https://vsnandy.github.io', 'http://localhost:3000', 'http://localhost:8000']
}));

dotenv.config();


// set the port
const port = process.env.PORT || 8000;

// setup api endpoints for use by app server
app.use('/football', football.router);

app.listen(port, () => {
  console.log('App is running on http://localhost:' + port);
});