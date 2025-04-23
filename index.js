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
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const routeTeacher = require('./routes/teacher');

routeClient(app);
routeAdmin(app);
app.use('/api/teacher', routeTeacher);

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`)
})