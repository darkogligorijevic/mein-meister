const router = require('express').Router()
const {check} = require('express-validator')

const fileUpload = require('../middlewares/file-upload')
const authControllers = require('../controllers/auth-controllers')

router.post('/register',
fileUpload.single('imageUrl')
,
[
  check('firstName').trim().not().isEmpty().isLength({max:25}),
  check('lastName').trim().not().isEmpty().isLength({max:25}),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({min:7})
],
authControllers.postUserRegister);

router.post('/login',authControllers.postUserLogin);


module.exports = router