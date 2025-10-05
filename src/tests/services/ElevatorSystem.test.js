const { expect } = require('chai');
const sinon = require('sinon');
const ElevatorSystem = require('../../services/ElevatorSystem');
const Elevator = require('../../services/Elevator');
const { DIRECTION, DOOR_STATE } = require('../../constants/ElevatorConstants');

describe('ElevatorSystem', () => {
    let system;
    let clock;

    beforeEach(() => {
        clock = sinon.useFakeTimers();
        system = ElevatorSystem;
        system.elevators = [
            new Elevator(1, 10),
            new Elevator(2, 10),
        ];
        system.servicedRequests = new Set();
        system.elevators.forEach(elevator => {
            sinon.stub(elevator, 'moveToFloor').callsFake(async (floor) => {
                elevator.currentFloor = floor;
                elevator.doorState = DOOR_STATE.CLOSED;
                elevator.direction = DIRECTION.IDLE;
                return elevator;
            });

            sinon.stub(elevator, 'openDoors').callsFake(async () => {
                elevator.doorState = DOOR_STATE.OPEN;
                return elevator;
            });
        });
    });

    afterEach(() => {
        clock.restore();
        system.elevators.forEach(elevator => {
            sinon.restore();
        });
    });

    it('should return all elevator statuses', () => {
        const statuses = system.getAllStatuses();
        expect(statuses).to.be.an('array').with.lengthOf(2);
        statuses.forEach(status => {
            expect(status).to.have.keys([
                'id', 'floor', 'direction', 'doorState', 'isMoving', 'queue'
            ]);
        });
    });

    it('should handle an external elevator call', async () => {
        const result = await system.callElevator(2, 5, DIRECTION.UP);
        expect(result.status.floor).to.equal(2);
        expect(result.status.doorState).to.equal(DOOR_STATE.OPEN);
        expect(result.message).to.include('Elevator');
    });

    it('should handle an internal elevator call', async () => {
        const result = await system.callElevator(0, 7, DIRECTION.UP, true, 1);
        expect(result.status.floor).to.equal(7);
        expect(result.status.doorState).to.equal(DOOR_STATE.OPEN);
        expect(result.message).to.include('Elevator 1 arrived');
    });
});
