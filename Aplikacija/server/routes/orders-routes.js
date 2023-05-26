const router = require('express').Router()
const {check} = require('express-validator')

const checkAuth = require('../middlewares/check-auth')
const orderControllers = require("../controllers/orders-controllers")


router.use(checkAuth);

router.get('/:orderId',
orderControllers.getOrderById)

router.post('/post/:postId',
[
  check('phoneNumber').matches(/^(\+381|0)6[0-9]{1}([0-9]{7}|[0-9]{6}|[0-9]{5}|[0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]{1})$/),
  check('description').trim().not().isEmpty().isLength({min:5})
]
,orderControllers.postOrderByPostId)

router.get('/worker/:workerId', orderControllers.getAllOrdersByWorkerId)
router.get('/user/:userId', orderControllers.getAllOrdersByUserId)

router.put('/:orderId', orderControllers.updateOrderById);

// router.get('/post/:postId',orderControllers.getOrdersByPostId)

// router.get('/post/:postId/user/:userId',orderControllers.getOrderByUser) // ??

module.exports = router;