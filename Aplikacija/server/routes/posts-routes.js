const router = require('express').Router()
const {check} = require('express-validator')

const checkAuth = require('../middlewares/check-auth')
const postsControllers = require('../controllers/posts-controllers')

router.get('/',postsControllers.getPostAll)

router.get('/:postId',postsControllers.getPostById)

router.get('/worker/:workerId',postsControllers.getPostByWorkerAll)

router.use(checkAuth)

router.post('/:workerId',
[
  // check('workerId').not().isEmpty().escape(),
  check('title').trim().not()
  .isEmpty(),
  check('description').trim().not()
  .isEmpty().isLength({min:5}),
  check('city').trim().not()
  .isEmpty()
],postsControllers.postPostcreate)

router.delete('/delete/:postId/worker/:workerId',postsControllers.deletePostById)

router.patch('/update/:postId/worker/:workerId', 
[
check('title').trim().not()
.isEmpty(),
check('description').trim().not()
.isEmpty().isLength({min:5}),
check('city').trim().not()
.isEmpty()
],postsControllers.patchPostById)


module.exports = router;

