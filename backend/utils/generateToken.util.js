import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    });

    res.cookie('jwt', token, {
        maxAge: Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // https
        sameSite: 'strict', // Against CSRF Attacks
    })
}

export default generateToken;