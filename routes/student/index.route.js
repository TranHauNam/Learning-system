const authRoutes = require('../common/auth.route');

module.exports = (app) => {
    app.use('/api/student/auth', authRoutes);
}