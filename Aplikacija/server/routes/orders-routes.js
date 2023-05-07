const router = require('express').Router()

const orderControllers = require("../controllers/orders-controllers")

router.get('/:orderId',orderControllers.getOrderById)

router.post('/post/:postId',orderControllers.postOrderByPostId)

router.get('/post/:postId',orderControllers.getOrdersByPostId)

module.exports = router;