const express = require('express')
const app = express();
// env
require('dotenv').config();
const port = process.env.PORT;

// Database
const database = require('./config/database.config');
database.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router
const routeAdmin = require('./routes/admin/index.route');
const routeTeacher = require('./routes/teacher/index.route');

routeAdmin(app);
routeTeacher(app);

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`)
})