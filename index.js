const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const football = require('./routes/football');
const espn = require('./routes/espn');

const app = express();

// set cors
app.use(cors({
  origin: ['https://vsnandy.github.io', 'http://localhost:3000', 'http://localhost:8000', 'http://localhost:8001'],
  credentials: true,
  exposedHeaders: ["set-cookie"]
}));

dotenv.config();


// set the port
const port = process.env.PORT || 3000;

// setup api endpoints for use by app server
app.use('/football', football.router);
app.use('/espn', espn.router);

app.listen(port, () => {
  console.log('App is running on http://localhost:' + port);
});
