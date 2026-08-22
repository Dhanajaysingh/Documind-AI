const User = require('../models/user.model');

const findUserByEmail = async (email) => {
    return User.findOne({ email });
};

const findUserById = async (id) => {
    return User.findById(id);
};

const createUser = async ({ name, email, passwordHash }) => {
    return User.create({
        name,
        email,
        passwordHash
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
