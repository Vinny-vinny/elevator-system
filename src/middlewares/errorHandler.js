const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
    logger.error(err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(status).json({
        success: false,
        message
    });
};
