const express = require('express');
const route = express.Router();
const controller  = require('../../controllers/admin/auth.controller');

route.post('/login', controller.login);
route.post('/logout', controller.logout);

module.exports = route;