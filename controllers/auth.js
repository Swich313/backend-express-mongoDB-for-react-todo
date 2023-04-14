const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {serialize} = require('cookie');

const User = require('../models/User');
require('dotenv/config');

const {signupEmail, resetPasswordEmail, successfulPasswordResetEmail} = require('../utils/emailTemplates');
const {sendEmail} = require('../services/mailService');
const {signupUser, loginUser, logoutUser, activate, refresh, resetPassword} = require('../services/authService');

exports.signup = async (req, res, next) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()){
          console.log(errors)
          const error = new Error('Validation failed');
          error.statusCode = 422;
          error.data = errors.array();
          throw error;
      }
      const {email, password, name} = req.body;
      const userData = await signupUser(email, password, name);

      // // implement sending refreshToken via httpOnly cookie;
      // res.cookie('refreshToken', userData.refreshToken, {
      //     maxAge: 30 * 24 * 60 * 60 * 1000,                                 //maxAge 30 day in milliseconds
      //     httpOnly: true,
      //     // sameSite: 'none',
      //     // secure: process.env.NODE_ENV === 'production',          //for https only
      //     path: '/'
      // })
      res.status(201).json({message: 'User created', user: userData, userId: userData.user._id});
  } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
  }
};

exports.login = async (req, res, next) => {
    try {
        const {email, password}  = req.body;
        const userData = await loginUser(email, password);

        // implement sending refreshToken via httpOnly cookie;
        // res.cookie('refreshToken', userData.refreshToken, {
        //     maxAge: 30 * 24 * 60 * 60 * 1000,                                 //maxAge 30 day in milliseconds
        //     // httpOnly: true,
        //     // sameSite: 'strict',
        //     // path: '/',
        //     // origin: 'http://127.0.0.1:5173',
        //     // secure: process.env.NODE_ENV === 'production',          //for https only
        // })
        // // res.setHeader('Set-Cookie', [`refreshToken=${userData.refreshToken};Domain=http://127.0.0.1/;HttpOnly;maxAge=2592000000;SameSite=Strict;`]);
        res.status(200).json({
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
            userId: userData.user._id.toString(),
            userEmail: userData.user.email,
            userName: userData.user.name});
        return;
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
};

exports.resetRequest = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            const error = new Error('Validation failed');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const {email, resetUrl} = req.body.email;
        const {refreshToken} = req.cookies;
        console.log({refreshToken, email, resetUrl});
        await resetPassword(email, resetUrl);
        res.status(200).json({message: 'Token for password reseting was created'});

    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }


    // try {
    //      crypto.randomBytes(32, (err, buffer) => {
    //         if(err) {
    //             console.log(err);
    //             throw err;
    //         }
    //         token = buffer.toString('hex');
    //     });
    //     const user = await User.findOne({email: email});
    //     if(!user) {
    //         const error = new Error('No user with such email was found!');
    //         error.statusCode = 401;
    //         throw error;
    //     }
    //     user.resetToken = token;
    //     user.resetTokenExpiration = Date.now() + 3600000;
    //     const result = await user.save();
    //     res.status(200).json({message: 'Token for password reseting was created'});
    //     const mailOutput = resetPasswordEmail(result.name, resetUrl, result.resetToken);
    //     const mailOptions = {
    //         from: process.env.EMAIL_UKR_NET,
    //         to: result.email,
    //         subject: `Password reset`,
    //         html: mailOutput,
    //     };
    //         sendEmail(result.email, mailOptions);
    // } catch (err) {
    //     if(!err.statusCode) {
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // }
};

exports.resetPassword = async (req, res, next) => {
    const newPassword = req.body.password;
    const passwordToken = req.body.passwordToken;
    const loginUrl = req.body.loginUrl;
    let resetUser;
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    try {
        const user = await User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {$gt: Date.now()}
    });
        if(!user) {
            const error = new Error('No user with such email was found!');
            error.statusCode = 401;
            throw error;
        }
        resetUser = user;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        const savedUser = await resetUser.save();
        res.status(200).json({message: 'Password updated'});
        const mailOutput = successfulPasswordResetEmail(savedUser.name, newPassword, loginUrl);
        const mailOptions = {
            from: process.env.EMAIL_UKR_NET,
            to: savedUser.email,
            subject: `Password reset`,
            html: mailOutput,
        };
        sendEmail(savedUser.email, mailOptions);
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.logout = async (req, res, next) => {
    try {
        // implement sending refreshToken via httpOnly cookie;
        // const refreshToken = req.cookies.refreshToken  ||
        //     req.headers.cookie ||
        //     req.cookies['refreshToken'];
        // const requestCookie = req.cookies;
        // const requestHeaders = req.headers;
        // console.log("logoutCntroller", {refreshToken})
        // const token = await logoutUser(refreshToken);
        // res.clearCookie('refreshToken');
        // const refreshToken = req.headers.cookie;
        const refreshToken = req.body.refreshToken;
        const token = await logoutUser(refreshToken);
        console.log({logoutController: refreshToken})
        res.status(200).json({message: 'User logout'});
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.activateEmail = async (req, res, next) => {
    try {
        const activateLink = req.params.link;
        console.log(activateLink);
        const loginUrl = `${process.env.FRONTEND_URL}auth?mode=login`;
        const user = await activate(activateLink, loginUrl);
        console.log(user)
        res.redirect(loginUrl);
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if(!authHeader) {
            const error = new Error('Not authenticated!');
            error.statusCode = 401;
            throw error;
        }
        const refreshToken = authHeader.split(' ')[1];
        // const {refreshToken} = req.body;
        console.log({refresh: refreshToken});

        // implement sending refreshToken via httpOnly cookie;
        // const {refreshToken} = req.cookies;
        const userData = await refresh(refreshToken);

        // implement sending refreshToken via httpOnly cookie;
        // res.cookie('refreshToken', userData.refreshToken, {
        //     httponly: true,
        //     sameSite: 'none',
        //     // secure: process.env.NODE_ENV === 'production',          //for https only
        //     maxAge: 30 * 24 * 60 * 60 * 1000,                                 //maxAge 30 day in milliseconds
        //     path: '/'
        // })
        res.status(200).json({accessToken: userData.accessToken, refreshToken: userData.refreshToken, userId: userData.user._id.toString()});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUserName = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) {
            const error = new Error('No user was found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({userName: user.name, userEmail: user.email});
    } catch (e) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};
