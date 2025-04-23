const homeRoutes = require('./home.route');
const courseRoutes = require("./course.route");
module.exports = (app) => {
    app.use('/', homeRoutes);
    app.use('/course', courseRoutes);
};