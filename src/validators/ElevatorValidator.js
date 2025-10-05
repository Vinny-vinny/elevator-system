const { body } = require('express-validator');
const { DIRECTION } = require('../constants/ElevatorConstants');

exports.validateCallElevator = [
    // Common validations
    body('isInternal')
        .optional()
        .isBoolean()
        .withMessage('isInternal must be a boolean'),

    // External call validations
    body('requestedFloor')
        .if((value, { req }) => !req.body.isInternal) // only if external
        .notEmpty()
        .withMessage('requestedFloor is required for external calls')
        .isInt({ min: 1 })
        .withMessage('requestedFloor must be a valid floor number'),

    body('direction')
        .if((value, { req }) => !req.body.isInternal) // only if external
        .notEmpty()
        .withMessage('direction is required for external calls')
        .isIn(Object.values(DIRECTION))
        .withMessage(`direction must be one of: ${Object.values(DIRECTION).join(', ')}`),

    // Internal call validations
    body('elevatorId')
        .if((value, { req }) => req.body.isInternal) // only if internal
        .notEmpty()
        .withMessage('elevatorId is required for internal calls')
        .isInt({ min: 1 })
        .withMessage('elevatorId must be a valid elevator number'),

    body('targetFloor')
        .if((value, { req }) => req.body.isInternal) // only if internal
        .notEmpty()
        .withMessage('targetFloor is required for internal calls')
        .isInt({ min: 1 })
        .withMessage('targetFloor must be a valid floor number'),
];
