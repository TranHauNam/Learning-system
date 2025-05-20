const authRoutes = require('../common/auth.route');
const courseRoutes = require('./course.routes');

module.exports = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/student/course', courseRoutes);
}