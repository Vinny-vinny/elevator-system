const EventEmitter = require('events');
const { DIRECTION,DOOR_STATE, ELEVATOR_EVENT } = require('../constants/ElevatorConstants');
const logger = require('../utils/logger');
class Elevator extends EventEmitter {
    constructor(id, totalFloors, options= {}) {
        super();
        this.id = id;
        this.currentFloor = 1;
        this.direction = DIRECTION.IDLE;
        this.doorState = DOOR_STATE.CLOSED;
        this.queue = new Set();
        this.totalFloors = totalFloors;
        this.isMoving = false;
    }

    addRequest(targetFloor) {
        if (targetFloor < 1 || targetFloor > this.totalFloors) return;
        this.queue.add(targetFloor);
        this.processQueue();
    }

    async processQueue() {
        if (this.isMoving || this.queue.size === 0) return;

        this.isMoving = true;

        let queueFloors = Array.from(this.queue).sort((a, b) => a - b);

        // If elevator is idle, pick direction toward nearest request
        if (this.direction === DIRECTION.IDLE) {
            const nearest = queueFloors.reduce((prev, curr) =>
                Math.abs(curr - this.currentFloor) < Math.abs(prev - this.currentFloor) ? curr : prev
            );
            this.direction = nearest > this.currentFloor ? DIRECTION.UP : DIRECTION.DOWN;
        }

        while (this.queue.size > 0) {
            queueFloors = Array.from(this.queue).sort((a, b) => a - b);

            // Requests in current direction
            const directionalRequests = this.direction === DIRECTION.UP
                ? queueFloors.filter(f => f >= this.currentFloor)
                : queueFloors.filter(f => f <= this.currentFloor).reverse();

            // If no more in current direction, reverse
            if (directionalRequests.length === 0) {
                this.direction = this.direction === DIRECTION.UP ? DIRECTION.DOWN : DIRECTION.UP;
                continue;
            }

            for (const floor of directionalRequests) {
                this.queue.delete(floor);
                await this.moveToFloor(floor);
            }
        }

        // When done, reset
        this.direction = DIRECTION.IDLE;
        this.isMoving = false;
        this.emit(ELEVATOR_EVENT.STATUS_CHANGE, this.status());
    }

    async moveToFloor(targetFloor) {
        if (this.isMoving) {
            this.addRequest(targetFloor);
            return;
        }

        if (targetFloor === this.currentFloor) {
            await this.openDoors();
            return;
        }

        this.isMoving = true;
        const diff = targetFloor - this.currentFloor;
        this.direction = diff > 0 ? DIRECTION.UP : DIRECTION.DOWN;
        this.emit(ELEVATOR_EVENT.STATUS_CHANGE, this.status());

        const maxFloors = 100;
        let safetyCounter = 0;

        while (this.currentFloor !== targetFloor && safetyCounter < maxFloors) {
            await this._sleep(5000);

            this.currentFloor += this.direction === DIRECTION.UP ? 1 : -1;
            safetyCounter++;

            logger.info(`Elevator ${this.id} at floor ${this.currentFloor}`);

            this.emit(ELEVATOR_EVENT.STATUS_CHANGE, this.status());
        }

        if (safetyCounter >= maxFloors) {
            logger.error(`Safety stop: Elevator ${this.id} exceeded ${maxFloors} moves trying to reach floor ${targetFloor}`);
            throw new Error(`Safety stop: Elevator ${this.id} exceeded ${maxFloors} moves trying to reach floor ${targetFloor}`);
        }

        await this.openDoors();

        this.isMoving = false;
        this.direction = DIRECTION.IDLE;
        this.emit(ELEVATOR_EVENT.STATUS_CHANGE, this.status());
    }

    async openDoors() {
        this.doorState = DOOR_STATE.OPEN;
        this.emit(ELEVATOR_EVENT.DOOR_STATUS, this.status());
        await this._sleep(2000);
        this.doorState = DOOR_STATE.CLOSED;
        this.emit(ELEVATOR_EVENT.DOOR_STATUS, this.status());
    }
    async _sleep(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    status() {
        return {
            id: this.id,
            floor: this.currentFloor,
            direction: this.direction,
            doorState: this.doorState,
            isMoving: this.isMoving,
            queue: Array.from(this.queue),
        };
    }
}

module.exports = Elevator;