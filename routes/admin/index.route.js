const authRoute = require('./auth.route');

module.exports = (app) => {
    app.use('/api/admin/auth', authRoute);
}