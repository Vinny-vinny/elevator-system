const Elevator = require('./Elevator');
const LookStrategy = require('./LookStrategy');
const logger = require('../utils/logger');

class ElevatorSystem {
    constructor(totalElevators = 3, totalFloors = 15) {
        if (ElevatorSystem.instance) return ElevatorSystem.instance;

        this.elevators = Array.from({ length: totalElevators }, (_, i) => new Elevator(i + 1, totalFloors));
        this.servicedRequests = new Set();
        ElevatorSystem.instance = this;
    }

    getAllStatuses() {
        return this.elevators.map((e) => e.status());
    }

    isFloorBeingServiced(floor, direction) {
        return this.servicedRequests.has(`${floor}:${direction}`);
    }

    markFloorAsServiced(floor, direction) {
        this.servicedRequests.add(`${floor}:${direction}`);
    }

    clearFloorRequest(floor, direction) {
        this.servicedRequests.delete(`${floor}:${direction}`);
    }

    /**
     * Handles both external and internal elevator requests
     * @param {number} requestedFloor - floor making the request
     * @param {number|null} targetFloor - destination floor (null for external)
     * @param {string} direction - 'UP' or 'DOWN'
     * @param {boolean} isInternal - true if request is from inside elevator
     * @param {number|null} elevatorId - optional elevator ID for internal calls
     */
    async callElevator(requestedFloor, targetFloor = null, direction, isInternal = false, elevatorId = null) {
        let assignedElevator;

        //EXTERNAL CALL
        if (!isInternal) {
            if (this.isFloorBeingServiced(requestedFloor, direction)) {
                logger.error(`Duplicate request for floor ${requestedFloor} going ${direction}`);
                throw new Error(`An elevator is already assigned to floor ${requestedFloor} going ${direction}`);
            }

            this.markFloorAsServiced(requestedFloor, direction);

            assignedElevator = LookStrategy.findBestElevator(this.elevators, requestedFloor, direction);
            if (!assignedElevator) {
                this.clearFloorRequest(requestedFloor, direction);
                logger.error('No available elevator to handle the request.');
                throw new Error('No available elevator to handle the request.');
            }

            try {
                await assignedElevator.moveToFloor(requestedFloor);
                await assignedElevator.openDoors();
            } catch (err) {
                logger.error(`Error while handling external request: ${err.message}`);
            } finally {
                 this.clearFloorRequest(requestedFloor, direction);
            }

            //User now needs to make an internal request
            return {
                message: `Elevator ${assignedElevator.id} has arrived at floor ${requestedFloor}. Please enter and select your destination.`,
                status: assignedElevator.status(),
            };
        }

        // INTERNAL CALL
        else {
            if (!elevatorId) {
                logger.error('Internal requests must specify elevatorId');
                throw new Error('Internal requests must specify elevatorId');
            }

            assignedElevator = this.elevators.find(e => e.id === elevatorId);
            if (!assignedElevator) {
                logger.error(`Elevator ${elevatorId} not found`);
                throw new Error(`Elevator ${elevatorId} not found`);
            }

            if (targetFloor == null || targetFloor === requestedFloor) {
                logger.error('A valid target floor must be specified for internal requests.');
                throw new Error('A valid target floor must be specified for internal requests.');
            }

            await assignedElevator.moveToFloor(targetFloor);
            await assignedElevator.openDoors();

            return {
                message: `Elevator ${elevatorId} arrived at floor ${targetFloor}. Doors opening.`,
                status: assignedElevator.status(),
            };
        }
    }
}

module.exports = new ElevatorSystem();
