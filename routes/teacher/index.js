const authRoutes = require('./auth.route');

module.exports = (app) => {
    app.use('/api/client', authRoutes);
}