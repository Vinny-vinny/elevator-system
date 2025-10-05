const { expect } = require('chai');
const sinon = require('sinon');

const ElevatorController = require('../../controllers/ElevatorController');
const ElevatorSystem = require('../../services/ElevatorSystem');
const elevatorLogRepo = require('../../repositories/ElevatorLogRepository');
const sqlLogRepo = require('../../repositories/SQLLogRepository');
const { DIRECTION, DOOR_STATE } = require('../../constants/ElevatorConstants');
const request = require("supertest");

describe('ElevatorController', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                requestedFloor: 1,
                targetFloor: 5,
                direction: DIRECTION.UP,
                isInternal: false,
            },
        };

        res = {
            json: sinon.spy(),
        };

        next = sinon.spy();

        // Stub dependencies
        sinon.stub(ElevatorSystem, 'callElevator');
        sinon.stub(ElevatorSystem, 'getAllStatuses');
        sinon.stub(elevatorLogRepo, 'logEvent').resolves();
        sinon.stub(sqlLogRepo, 'logQuery').resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('callElevator', () => {
        it('should successfully call the elevator for external request', async () => {
            const fakeStatus = {
                id: 1,
                floor: 5,
                direction: DIRECTION.UP,
                doorState: DOOR_STATE.CLOSED,
                isMoving: false,
                queue: [],
            };

            ElevatorSystem.callElevator.resolves(fakeStatus);

            await ElevatorController.callElevator(req, res, next);

            // Assertions
            expect(ElevatorSystem.callElevator.calledOnce).to.be.true;
            expect(ElevatorSystem.callElevator.firstCall.args).to.deep.equal([
                1, 5, DIRECTION.UP, false, undefined,
            ]);
            expect(elevatorLogRepo.logEvent.calledOnce).to.be.true;
            expect(sqlLogRepo.logQuery.calledOnce).to.be.true;
            expect(res.json.calledOnce).to.be.true;

            const response = res.json.firstCall.args[0];
            expect(response.success).to.be.true;
            expect(response.status).to.deep.equal(fakeStatus);
        });

        it('should handle internal elevator call properly', async () => {
            req.body.isInternal = true;
            req.body.elevatorId = 2;

            const fakeStatus = {
                id: 2,
                floor: 7,
                direction: DIRECTION.UP,
                doorState: DOOR_STATE.CLOSED,
                isMoving: true,
                queue: [3, 5, 7],
            };

            ElevatorSystem.callElevator.resolves(fakeStatus);

            await ElevatorController.callElevator(req, res, next);

            expect(ElevatorSystem.callElevator.calledOnce).to.be.true;
            const args = ElevatorSystem.callElevator.firstCall.args;
            expect(args).to.deep.equal([1, 5, DIRECTION.UP, true, 2]);

            expect(elevatorLogRepo.logEvent.calledOnce).to.be.true;
            expect(sqlLogRepo.logQuery.calledOnce).to.be.true;

            const response = res.json.firstCall.args[0];
            expect(response.success).to.be.true;
            expect(response.status.id).to.equal(2);
        });

        it('should call next with error on failure', async () => {
            const fakeError = new Error('Something went wrong');
            ElevatorSystem.callElevator.rejects(fakeError);

            await ElevatorController.callElevator(req, res, next);

            expect(next.calledOnce).to.be.true;
            expect(next.firstCall.args[0]).to.equal(fakeError);
            expect(res.json.notCalled).to.be.true;
        });

        it('should skip logging if elevator call fails before status response', async () => {
            const fakeError = new Error('DB connection lost');
            ElevatorSystem.callElevator.rejects(fakeError);

            await ElevatorController.callElevator(req, res, next);

            expect(elevatorLogRepo.logEvent.notCalled).to.be.true;
            expect(sqlLogRepo.logQuery.notCalled).to.be.true;
        });
    });

    describe('getElevatorStatus', () => {
        it('should call next with error if exception occurs', async () => {
            const fakeError = new Error('Failed to fetch statuses');
            ElevatorSystem.getAllStatuses.throws(fakeError);

            await ElevatorController.getElevatorStatus(req, res, next);

            expect(next.calledOnce).to.be.true;
        });
    });
});
