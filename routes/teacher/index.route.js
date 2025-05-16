const authRoutes = require('./auth.route');
const profileRoutes = require('./profile.route');

module.exports = (app) => {
    app.use('/api/teacher/auth', authRoutes);
    app.use('/api/teacher/profile', profileRoutes);
}