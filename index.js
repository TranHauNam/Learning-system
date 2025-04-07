const express = require('express')
const app = express();
// env
require('dotenv').config();
const port = process.env.PORT;

// Database
const database = require('./config/database.config');
database.connect();

// Router
const route = require('./routes/client/index.route');
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})