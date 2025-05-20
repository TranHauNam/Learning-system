const express = require('express')
const cors = require('cors');
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
app.use(cors({
  origin: 'http://localhost:3000', // hoặc '*', nhưng không khuyến khích
  credentials: true // nếu dùng cookie/token
}));


// Router
const routeAdmin = require('./routes/admin/index.route');
const routeTeacher = require('./routes/teacher/index.route');
const routeStudent = require('./routes/student/index.route');

routeAdmin(app);
routeTeacher(app);
routeStudent(app)

app.listen(port, () => {
  console.log(`Connected successfully on port ${port}`)
})