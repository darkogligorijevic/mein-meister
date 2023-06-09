const router = require('express').Router()
const {check} = require('express-validator')

const fileUpload = require('../middlewares/file-upload');
const authControllers = require('../controllers/auth-controllers');
const checkAuth = require('../middlewares/check-auth');


router.post('/register',
fileUpload.single('imageUrl'),
[
  check('firstName').trim().not().isEmpty().isLength({max:25}),
  check('lastName').trim().not().isEmpty().isLength({max:25}),
  check('email').normalizeEmail().isEmail(),
  check('password').trim().isLength({min:7}),
  check('isAdministrator')
],
authControllers.postUserRegister);

router.post('/login',authControllers.postUserLogin);


router.use(checkAuth);

router.patch('/update',
fileUpload.single('imageUrl'),
[
  check('firstName').trim().not().isEmpty().isLength({max:25}),
  check('lastName').trim().not().isEmpty().isLength({max:25}),
  check('email').normalizeEmail().isEmail(),
],
authControllers.updateUserLogIn);

router.patch('/update/password',
[
  check('oldPassword').trim().isLength({min:7}),
  check('newPassword').trim().isLength({min:7})
],
authControllers.updateUserPassword)

router.delete('/delete',
  authControllers.deleteUserLogin
)


module.exports = router