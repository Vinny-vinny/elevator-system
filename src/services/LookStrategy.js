const {DIRECTION} = require('../constants/ElevatorConstants');
class LookStrategy {
    static findBestElevator(elevators, requestedFloor, direction) {
        let best = null;
        let minDistance = Infinity;

        elevators.forEach((elevator) => {
            const distance = Math.abs(elevator.currentFloor - requestedFloor);

            if (
                elevator.direction === DIRECTION.IDLE ||
                (elevator.direction === direction &&
                    ((direction === DIRECTION.UP && elevator.currentFloor <= requestedFloor) ||
                        (direction === DIRECTION.DOWN && elevator.currentFloor >= requestedFloor)))
            ) {
                if (distance < minDistance) {
                    best = elevator;
                    minDistance = distance;
                }
            }
        });

        // Fallback to nearest idle elevator if none matches
        if (!best) {
            best = elevators.sort(
                (a, b) => Math.abs(a.currentFloor - requestedFloor) - Math.abs(b.currentFloor - requestedFloor)
            )[0];
        }

        return best;
    }
}

module.exports = LookStrategy;
