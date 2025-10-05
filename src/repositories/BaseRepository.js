class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data, options = {}) {
        return await this.model.create(data, options);
    }

    async findAll(where = {}, options = {}) {
        return await this.model.findAll({ where, ...options });
    }

    async findOne(where = {}, options = {}) {
        return await this.model.findOne({ where, ...options });
    }

    async update(where, data) {
        return await this.model.update(data, { where });
    }

    async delete(where) {
        return await this.model.destroy({ where });
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }
}

module.exports = BaseRepository;
