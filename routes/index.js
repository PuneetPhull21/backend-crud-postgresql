var express = require('express');
var router = express.Router();
const controller = require('../service/user.controller');

/* GET home page. */
router.post('/register',controller.register);

module.exports = router;
