const authRoutes = require('../common/auth.route');
const profileRoutes = require('./profile.route');
const courseRoutes = require('./course.route');
const categoryRoutes = require('./category.route');

module.exports = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/teacher/profile', profileRoutes);
    app.use('/api/teacher/courses', courseRoutes);
    app.use('/api/teacher/categories', categoryRoutes);
}