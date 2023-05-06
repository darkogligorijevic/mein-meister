const router = require('express').Router()

const postsControllers = require('../controllers/posts-controllers')


router.post('/:workerId',postsControllers.postPostcreate)

router.get('/',postsControllers.getPostAll)

router.get('/:postId',postsControllers.getPostById)

router.get('/worker/:workerId',postsControllers.getPostByWorkerAll)

router.delete('/delete/:postId',postsControllers.deletePostById)

router.patch('/update/:postId',postsControllers.patchPostById)


module.exports = router;

