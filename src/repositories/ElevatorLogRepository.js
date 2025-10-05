const BaseRepository = require('./BaseRepository');
const { ElevatorLog } = require('../database/models');

class ElevatorLogRepository extends BaseRepository {
    constructor() {
        super(ElevatorLog);
    }

    async logEvent({
                       elevatorId,
                       currentFloor,
                       direction,
                       doorState,
                       requestedFloor,
                       targetFloor,
                   }) {
        return await this.create({
            elevatorId,
            currentFloor,
            direction,
            doorState,
            requestedFloor,
            targetFloor
        });
    }

    async getRecentLogs(limit = 50) {
        return await this.findAll({}, { order: [['createdAt', 'DESC']], limit });
    }
}
module.exports = new ElevatorLogRepository();
