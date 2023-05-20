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
  check('password').isLength({min:7})
],
authControllers.postUserRegister);

router.post('/login',authControllers.postUserLogin);


router.use(checkAuth);

router.patch('/update',
fileUpload.single('imageUrl'),
[
  // ovo ime, prezime, email, sifra samo treba da se promeni kao gore, to sam zaboravio
  check('ime').trim().not().isEmpty().isLength({max:25}),
  check('prezime').trim().not().isEmpty().isLength({max:25}),
  check('email').normalizeEmail().isEmail(),
  check('sifra').isLength({min:7})
],
authControllers.updateUserLogIn);

router.delete('/delete',
  authControllers.deleteUserLogin
)


module.exports = router