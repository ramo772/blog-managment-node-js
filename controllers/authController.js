const { createUser, loginUser } = require("../services/userService")
const _ = require('lodash');


const register = async (req, res) => {
    try {
        const { token, user } = await createUser(req.body)
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        return res.status(400).send(err.message)
    }

}
const login = async (req, res) => {
    try {
        const { token, user } = await loginUser(req.body)
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        return res.status(400).send(err.message)
    }

}


module.exports = {
    register,
    login
}