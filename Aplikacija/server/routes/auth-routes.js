const router = require('express').Router()

const authControllers = require('../controllers/auth-controllers')

router.post('/register',authControllers.postUserRegister);

router.post('/login',authControllers.postUserLogin);


module.exports = router