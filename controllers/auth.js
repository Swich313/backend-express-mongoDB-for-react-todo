const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
require('dotenv/config');

const {signupEmail, resetPasswordEmail, successfulPasswordResetEmail} = require('../utils/emailTemplates');

const smtpConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
      user: process.env.EMAIL_UKR_NET,
      pass: process.env.PASS_UKR_NET_IMAP,
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
      console.log(errors)
      const error = new Error('Validation failed');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const loginUlr = req.body.loginUrl;
  const mailOutput = signupEmail(name, email, password, loginUlr);
  const mailOptions = {
      from: process.env.EMAIL_UKR_NET,
      to: email,
      subject: `Welcome ${name}`,
      text: 'Have You just sign up?',
      html: mailOutput,
  };
  try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
          email: email,
          password: hashedPassword,
          name: name,
      });
      const result = await user.save();
      res.status(201).json({message: 'User created', userId: result._id});
      transporter.sendMail(mailOptions,
          (err, info) => {
              err ? console.log(err) : console.log(`Email sent to: ${email}, response: ${info.response}`);
          })
  } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
  }
};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            const error = new Error('No user with such email was found!');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        res.status(200).json({token: token, userId: loadedUser._id.toString()});

    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.resetRequest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const resetUrl = req.body.resetUrl;

    let token;
    try {
         crypto.randomBytes(32, (err, buffer) => {
            if(err) {
                console.log(err);
                throw err;
            }
            token = buffer.toString('hex');
        });
        const user = await User.findOne({email: email});
        if(!user) {
            const error = new Error('No user with such email was found!');
            error.statusCode = 401;
            throw error;
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        const result = await user.save();
        res.status(200).json({message: 'Token for password reseting was created'});
        const mailOutput = resetPasswordEmail(result.name, resetUrl, token);
        const mailOptions = {
            from: process.env.EMAIL_UKR_NET,
            to: email,
            subject: `Password reset`,
            html: mailOutput,
        };
        transporter.sendMail(mailOptions,
            (err, info) => {
                err ? console.log(err) : console.log(`Email sent to: ${email}, response: ${info.response}`);
            })
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
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
        transporter.sendMail(mailOptions,
            (err, info) => {
                err ? console.log(err) : console.log(`Email sent to: ${savedUser.email}, response: ${info.response}`);
            })
    } catch (err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
