const router = require('express').Router()
const {check} = require('express-validator')

const fileUpload = require('../middlewares/file-upload')
const checkAuth = require('../middlewares/check-auth')
const postsControllers = require('../controllers/posts-controllers')

router.get('/',postsControllers.getPostAll)

router.get('/:postId',postsControllers.getPostById)

router.get('/worker/:workerId',postsControllers.getPostByWorkerAll)

router.use(checkAuth)

router.post(
  '/:workerId',
  fileUpload.single('imageUrl'),
  [
    check('title').trim().not().isEmpty(),
    check('description').trim().not().isEmpty().isLength({ min: 5 }),
    check('city').trim().not().isEmpty(),
    check('category').trim().not().isEmpty(),
    check('price').isNumeric()
  ],
  postsControllers.postCreate
);

router.delete('/delete/:postId/worker/:workerId',postsControllers.deletePostById)

router.patch('/update/:postId/worker/:workerId',
fileUpload.single('imageUrl'),
[
  check('title').trim().not().isEmpty(),
    check('description').trim().not().isEmpty().isLength({ min: 5 }),
    check('city').trim().not().isEmpty(),
    check('category').trim().not().isEmpty(),
    check('price').isNumeric()
],postsControllers.patchPostById)


module.exports = router;

