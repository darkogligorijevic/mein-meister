const router = require('express').Router()
const {check} = require('express-validator')

const checkAuth = require('../middlewares/check-auth')
const workersControllers = require('../controllers/workers-controllers')



router.get('/',workersControllers.getWorkerAll)

router.get('/:workerId',workersControllers.getWorkerById)

router.use(checkAuth);

router.post('/',
[
  check('phone').isNumeric()
]
,workersControllers.postWorkerCreate)

router.delete('/:workerId',workersControllers.deleteWorkerById)

router.patch('/:workerId',
[
  check('phone').isNumeric()
]
,workersControllers.patchWorkerById)

module.exports = router;