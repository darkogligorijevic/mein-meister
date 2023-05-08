const router = require('express').Router()
const {check} = require('express-validator')

const workersControllers = require('../controllers/workers-controllers')


router.post('/',
[
  check('phone').isNumeric()
]
,workersControllers.postWorkerCreate)

router.get('/',workersControllers.getWorkerAll)

router.get('/:workerId',workersControllers.getWorkerById)

router.delete('/:workerId',workersControllers.deleteWorkerById)

router.patch('/:workerId',
[
  check('phone').isNumeric()
]
,workersControllers.patchWorkerById)

module.exports = router;