const router = require('express').Router();
const {check} = require('express-validator');

const checkAuth = require('../middlewares/check-auth');
const workersControllers = require('../controllers/workers-controllers');



router.get('/',workersControllers.getWorkerAll); // mozda treba da se brise

router.get('/:workerId',workersControllers.getWorkerById); // mozda treba da se brise

router.get('/userId/:userId', workersControllers.getWorkerByUserId);

router.use(checkAuth);

router.post('/', [  
  check('phone').matches(/^(\+381|0)6[0-9]{1}([0-9]{7}|[0-9]{6}|[0-9]{5}|[0-9]{4}|[0-9]{3}|[0-9]{2}|[0-9]{1})$/)
], 
workersControllers.postWorkerCreate);

module.exports = router;