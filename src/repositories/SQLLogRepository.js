const BaseRepository = require('./BaseRepository');
const { SqlLog } = require('../database/models');

class SqlLogRepository extends BaseRepository {
    constructor() {
        super(SqlLog);
    }

    async logQuery({ query, action, endpoint, metadata }) {
        return await this.create({
            query,
            action,
            endpoint,
            metadata
        });
    }
}

module.exports = new SqlLogRepository();
