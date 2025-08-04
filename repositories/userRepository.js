
const BaseRepository = require('./baseRepository');
const { User } = require('../models/user');

class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }
}

module.exports = new UserRepository();
