import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        res.status(403);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded._id).select('-password');
        req.user = user;
        return next();
    } catch (error) {
        res.status(403);
        throw new Error('Not authorized, invalid token');
    }
});

export { protect };