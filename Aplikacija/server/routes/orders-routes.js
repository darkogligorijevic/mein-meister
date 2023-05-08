const router = require('express').Router()
const {check} = require('express-validator')

const checkAuth = require('../middlewares/check-auth')
const orderControllers = require("../controllers/orders-controllers")


router.use(checkAuth);

router.get('/:orderId',
orderControllers.getOrderById)

router.post('/post/:postId',
[
  check('phoneNumber').isNumeric(),
  check('description').trim().not()
  .isEmpty().isLength({min:5})

]
,orderControllers.postOrderByPostId)

router.get('/post/:postId',orderControllers.getOrdersByPostId)

module.exports = router;