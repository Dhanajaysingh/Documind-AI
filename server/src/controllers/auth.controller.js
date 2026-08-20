const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    createUser,
    findUserByEmail,
    findUserById
} = require('../services/user.service');

const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
};

const authCookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'documind-dev-secret';
};

const getPublicUser = (user) => {
    return {
        id: user.id,
        name: user.name,
        email: user.email
    };
};

const setAuthCookie = (res, user) => {
    const token = jwt.sign(
        {
            userId: user.id
        },
        getJwtSecret(),
        {
            expiresIn: '7d'
        }
    );

    res.cookie('token', token, authCookieOptions);
};

const register = async (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        });
    }

    const existingUser = findUserByEmail(email);

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'An account with this email already exists'
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = createUser({
        name,
        email,
        passwordHash
    });

    setAuthCookie(res, user);

    res.status(201).json({
        success: true,
        user: getPublicUser(user)
    });
};

const login = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    const user = findUserByEmail(email);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }

    setAuthCookie(res, user);

    res.json({
        success: true,
        user: getPublicUser(user)
    });
};

const getCurrentUser = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not logged in'
        });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        const user = findUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        res.json({
            success: true,
            user: getPublicUser(user)
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired session'
        });
    }
};

const logout = (req, res) => {
    res.clearCookie('token', cookieOptions);

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

module.exports = {
    register,
    login,
    getCurrentUser,
    logout
};
