const fs = require('fs');
const path = require('path');

const dataFolder = path.resolve(__dirname, '../../data');
const usersFile = path.join(dataFolder, 'users.json');

const ensureUsersFile = () => {
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, '[]', 'utf-8');
    }
};

const readUsers = () => {
    ensureUsersFile();
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
};

const saveUsers = (users) => {
    ensureUsersFile();
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
};

const findUserByEmail = (email) => {
    const users = readUsers();
    return users.find((user) => user.email === email);
};

const findUserById = (id) => {
    const users = readUsers();
    return users.find((user) => user.id === id);
};

const createUser = ({ name, email, passwordHash }) => {
    const users = readUsers();
    const user = {
        id: Date.now().toString(),
        name,
        email,
        passwordHash,
        createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);

    return user;
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};
