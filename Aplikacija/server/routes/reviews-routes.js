const router = require('express').Router()

const reviewControllers = require('../controllers/reviews-controllers')

router.post('/:postId',reviewControllers.postReviewByPostId)

router.get('/:postId',reviewControllers.getReviewsByPostId)


module.exports = router;