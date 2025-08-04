class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    return await this.model.find({});
  }
  async create(data) {
    return await this.model.create(data);
  }

  async find(filter = {}) {
    return await this.model.find(filter);
  }

  async findById(id) {
    return await this.model.findById(id);
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }
  async findOneBy(filter = {}) {
    return this.model.findOne(filter)
  }


  async getAllWith(relations = [], paginate = true, filter = {}, options = {}) {
    if (paginate) {
      if (!options.page) options.page = 1;
      if (!options.limit) options.limit = 10;
      const { page, limit, sort } = options;
      return await this.model.paginate(filter, {
            page,
            limit,
            populate: relations,
            sort,
        });
    }
    return await this.model.find(filter).populate(relations);
}

async findOneWith(id, relations = []) {
  return await this.model.findById(id).populate(relations);
}

}

module.exports = BaseRepository;
