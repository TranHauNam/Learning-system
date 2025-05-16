const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');

module.exports = (app) => {
    app.use('/api/admin/auth', authRoute);
    app.use('/api/admin/categories', categoryRoute);
}