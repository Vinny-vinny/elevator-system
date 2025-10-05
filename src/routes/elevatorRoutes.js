const express = require('express');
const router = express.Router();
const elevatorController = require('../controllers/ElevatorController');
const { validateCallElevator } = require('../validators/ElevatorValidator');
const validateRequest = require('../middlewares/validateRequest');

router.post('/call', validateCallElevator, validateRequest, elevatorController.callElevator);

router.get('/status', elevatorController.getElevatorStatus);

module.exports = router;
