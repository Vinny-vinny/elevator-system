const ElevatorSystem = require('../services/ElevatorSystem');
const elevatorLogRepo = require('../repositories/ElevatorLogRepository');
const sqlLogRepo = require('../repositories/SQLLogRepository');
const { DIRECTION, ELEVATOR_EVENT} = require('../constants/ElevatorConstants');
const logger = require('../utils/logger');
exports.callElevator = async (req, res, next) => {
    try {
        const {
            requestedFloor,
            targetFloor,
            direction,
            isInternal = false,
            elevatorId
        } = req.body || {};

        const status = await ElevatorSystem.callElevator(
            requestedFloor,
            targetFloor,
            direction || DIRECTION.UP,
            isInternal,
            elevatorId
        );

        await elevatorLogRepo.logEvent({
            elevatorId: status.id,
            currentFloor: status.floor,
            direction: status.direction,
            doorState: status.doorState,
            requestedFloor,
            targetFloor
        });

        await sqlLogRepo.logQuery({
            query: `INSERT INTO elevator_logs (elevator_id, requested_floor, target_floor, direction, triggered_by) VALUES (${status.id}, ${requestedFloor}, ${targetFloor}, '${direction}')`,
            action: 'INSERT',
            endpoint: '/api/elevator/call',
            metadata: {
                elevatorId: status.id,
                requestedFloor,
                targetFloor,
                direction,
                isInternal
            },
        });

        return res.json({
            success: true,
            message: isInternal
                ? `Internal Call Request Successfully Processed.`
                : `External Call Request Successfully Processed.`,
            status,
        });
    } catch (err) {
        next(err);
    }
};

exports.getElevatorStatus = async (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();
        const statuses = ElevatorSystem.getAllStatuses();
        res.write(`data: ${JSON.stringify(statuses)}\n\n`);
        const sendStatusUpdate = (status) => {
            res.write(`data: ${JSON.stringify(status)}\n\n`);
        };

        ElevatorSystem.elevators.forEach((elevator) => {
            elevator.on(ELEVATOR_EVENT.STATUS_CHANGE, sendStatusUpdate);
        });

        req.on('close', () => {
            logger.info('Client disconnected from SSE');
            ElevatorSystem.elevators.forEach((elevator) => {
                elevator.off(ELEVATOR_EVENT.STATUS_CHANGE, sendStatusUpdate);
            });
            res.end();
        });
    } catch (err) {
        next(err);
    }
};
