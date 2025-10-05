const { expect } = require('chai');
const sinon = require('sinon');
const Elevator = require('../../services/Elevator');
const { DIRECTION, DOOR_STATE } = require('../../constants/ElevatorConstants');

describe('Elevator', () => {
    let elevator;
    let clock;

    beforeEach(() => {
        // Fake timers to control all setTimeout calls
        clock = sinon.useFakeTimers();

        // Initialize a new elevator
        elevator = new Elevator(1, 10);

        // Stub processQueue for tests that don't require actual movement
        sinon.stub(elevator, 'processQueue').resolves();
    });

    afterEach(() => {
        // Restore timers and stubs
        clock.restore();
        if (elevator.processQueue.restore) elevator.processQueue.restore();

        // Stop elevator loop if a stop method exists
        if (typeof elevator.stop === 'function') elevator.stop();
    });

    it('should initialize correctly', () => {
        expect(elevator.id).to.equal(1);
        expect(elevator.currentFloor).to.equal(1);
        expect(elevator.direction).to.equal(DIRECTION.IDLE);
        expect(elevator.doorState).to.equal(DOOR_STATE.CLOSED);
        expect(elevator.queue.size).to.equal(0);
    });

    it('should add requests without duplicates', () => {
        elevator.addRequest(5);
        elevator.addRequest(5); // duplicate
        expect(elevator.queue.size).to.equal(1);
    });

    it('should move to a floor and open doors', async function () {
        this.timeout(5000); // Increase timeout for async test

        // Restore processQueue to run real movement logic
        elevator.processQueue.restore();

        const movePromise = elevator.moveToFloor(3);

        // Fast-forward all timers immediately
        if (clock.runAllAsync) {
            await clock.runAllAsync(); // Sinon v15+
        } else {
            clock.runAll();
        }

        await movePromise;

        expect(elevator.currentFloor).to.equal(3);
        expect(elevator.doorState).to.equal(DOOR_STATE.CLOSED);
        expect(elevator.direction).to.equal(DIRECTION.IDLE);
        expect(elevator.queue.size).to.equal(0);
    });
});
