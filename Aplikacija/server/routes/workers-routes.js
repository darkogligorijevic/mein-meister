const router = require('express').Router()

const workersControllers = require('../controllers/workers-controllers')


router.post('/',workersControllers.postWorkerCreate)

router.get('/',workersControllers.getWorkerAll)

router.get('/:workerId',workersControllers.getWorkerById)

router.delete('/:workerId',workersControllers.deleteWorkerById)

router.patch('/:workerId',workersControllers.patchWorkerById)

module.exports = router;