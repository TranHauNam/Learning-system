const authRoutes = require('./auth.route');
const profileRoutes = require('./profile.route');

module.exports = (app) => {
    app.use('/api/teacher', authRoutes);
    app.use('/api/teacher', profileRoutes)
}