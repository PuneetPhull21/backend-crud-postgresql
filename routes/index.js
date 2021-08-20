var express = require('express');
var router = express.Router();
const controller = require('../service/user.controller');

/* GET home page. */
router.post('/register',controller.register);
router.get('/:id',controller.fetch);
router.put('/:id',controller.update);
router.delete('/:id',controller.delete);
router.get('/verify/:token',controller.verifyemail);
router.post('/login',controller.login);
module.exports = router;
