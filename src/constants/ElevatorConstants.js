const DIRECTION = Object.freeze({
    UP: 'up',
    DOWN: 'down',
    IDLE: 'idle',
});

const DOOR_STATE = Object.freeze({
    OPEN: 'open',
    CLOSED: 'closed',
});

const ELEVATOR_EVENT = Object.freeze({
    STATUS_CHANGE: 'statusChange',
    DOOR_STATUS: 'doorStatus',
});

module.exports = {
    DIRECTION,
    DOOR_STATE,
    ELEVATOR_EVENT,
};
