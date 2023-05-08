const router = require('express').Router()
const {check} = require('express-validator')

const reviewControllers = require('../controllers/reviews-controllers')

router.post('/postId/:postId',
[
  check('star').isFloat({min:1, max:5}),
  check('reviewText').trim().not().isEmpty().isLength({min:10})
],
reviewControllers.postReviewByPostId)

router.patch('/id/:reviewId/post/:postId',
[
  check('star').isFloat({min:1, max:5}),
  check('reviewText').trim().not().isEmpty().isLength({min:10})
]
,reviewControllers.patchReviewByPostId)

router.get('/all/:postId',reviewControllers.getReviewsByPostId);

router.delete('/:reviewId/testUserId/:userId',reviewControllers.deleteReviewByPostId); // userId se nece slati preko dynamic path parametara


module.exports = router;