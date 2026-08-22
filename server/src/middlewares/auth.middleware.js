const jwt = require('jsonwebtoken');
const { findUserById } = require('../services/user.service');

const getJwtSecret = () => {
    return process.env.JWT_SECRET || 'documind-dev-secret';
};

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        const user = await findUserById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired session'
        });
    }
};

module.exports = {
    authMiddleware
};
