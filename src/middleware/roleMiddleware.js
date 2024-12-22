require('dotenv').config();
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                errCode: 1,
                message: 'Unauthorized! User not logged in.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                errCode: 2,
                message: 'Forbidden! You do not have permission.'
            });
        }
        next();
    };
};

const jwt = require('jsonwebtoken');
const secretKey = process.env.KEY;

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            errCode: 1,
            message: 'Authentication failed! Token missing.'
        });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Gán thông tin user vào request
        next();
    } catch (error) {
        return res.status(401).json({
            errCode: 2,
            message: 'Authentication failed! Invalid token.'
        });
    }
};


module.exports = {
    checkRole,
    authenticate
};
