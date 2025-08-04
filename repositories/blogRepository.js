
const BaseRepository = require('./baseRepository');
const { Blog } = require('../models/blog');

class BlogRepository extends BaseRepository {
  constructor() {
    super(Blog);
  }

}

module.exports = new BlogRepository();
