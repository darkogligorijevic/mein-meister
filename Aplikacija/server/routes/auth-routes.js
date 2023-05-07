const router = require('express').Router()
const {check} = require('express-validator')

const authControllers = require('../controllers/auth-controllers')

router.post('/register',
[
  check('ime').trim().not().isEmpty().isLength({max:25}),
  check('prezime').trim().not().isEmpty().isLength({max:25}),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({min:7})
],
authControllers.postUserRegister);

router.post('/login',authControllers.postUserLogin);


module.exports = router