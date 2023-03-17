const jwt = require("jsonwebtoken");
const {serialize} = require("cookie");

const Token = require('../models/Token');

exports.generateToken = (payload) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.JWT_ACCESS_EXPIRES_IN});  //expires in 1 hour;
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d' });                    //expires in 30 days;
        // (_err, refreshToken) => {
        //     const serialized = serialize('token', refreshToken, {
        //         httpOnly: true,
        //         sameSite: 'none',
        //         // secure: process.env.NODE_ENV === 'production',
        //         maxAge: 60 * 60 * 24 * 30,                              //maXAge for HTTPonly cookie 30days
        //         path: '/',
        //     });
        //     res.setHeader('Set-Cookie', serialized);
        // }
    return {accessToken, refreshToken};
};

exports.saveToken = async (userId, refreshToken) => {
    const tokenData = await Token.findOne({userId});
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }
    const token = await Token.create({userId, refreshToken});
    return token;
};

exports.removeToken = async (refreshToken) => {
    const tokenData = await Token.deleteOne({refreshToken});
    return tokenData;
};

exports.validateAccessToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return userData;
    } catch (err) {
        return null;
    }
};

exports.validateRefreshToken = (token) => {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (err) {
        return null;
    }
};

exports.findToken = async (refreshToken) => {
    const tokenData = await Token.findOne({refreshToken});
    return tokenData;
};


