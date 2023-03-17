const User = require('../models/User');
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const {activationEmail, signupEmail, resetPasswordEmail} = require("../utils/emailTemplates");
const {sendEmail} = require("./mailService");
const {generateToken, saveToken, removeToken, validateRefreshToken, findToken} = require('./tokenService');
const jwt = require("jsonwebtoken");
const {serialize} = require("cookie");

let initialPassword;

const signupUser = async (email, password, name) => {
    initialPassword = password;
    const existingUser = await User.findOne({email});
    if(existingUser){
        const error = new Error(`User with email ${email} already exists!`);
        error.statusCode = 422;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const activationLink = crypto.randomUUID();
    const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
        activationLink,
    });
    const savedUser = await user.save();
    const mailOutput = activationEmail(savedUser.name, savedUser.activationLink);
    const mailOptions = {
        from: process.env.EMAIL_UKR_NET,
        to: savedUser.email,
        subject: `Welcome ${savedUser.name}`,
        text: 'Have You just sign up?',
        html: mailOutput,
    };
    sendEmail(savedUser.email, mailOptions);
    const tokens = generateToken({
        email: savedUser.email,
        userId: savedUser._id.toString(),
        isActivated: savedUser.isActivated
    });
    await saveToken(savedUser._id, tokens.refreshToken);

    return {...tokens, user: savedUser};
};

exports.loginUser = async (email, password) => {
    const user = await User.findOne({email: email});
    if(!user){
        const error = new Error(`No user with such email ${email} was found!`);
        error.statusCode = 401;
        throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if(!isEqual){
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
    }
    const tokens = generateToken({
        email: user.email,
        userId: user._id.toString(),
        isActivated: user.isActivated
    });
    await saveToken(user._id, tokens.refreshToken);

    return {...tokens, user: user};
};

exports.logoutUser = async (refreshToken) => {
    const token = removeToken(refreshToken);
    return token;
};

exports.resetPassword = async (email, resetUrl) => {
    const resetPasswordLink = crypto.randomUUID();
    const user = await User.findOne({email: email});
    if(!user) {
        const error = new Error('No user with such email was found!');
        error.statusCode = 401;
        throw error;
    }
    user.resetToken = resetPasswordLink;
    user.resetTokenExpiration = Date.now() + 3600000;
    const savedUser = await user.save();
    const mailOutput = resetPasswordEmail(savedUser.name, resetUrl, savedUser.resetToken);
    const mailOptions = {
        from: process.env.EMAIL_UKR_NET,
        to: savedUser.email,
        subject: `Password reset`,
        html: mailOutput,
    };
    sendEmail(savedUser.email, mailOptions);
};

exports.activate = async (activationLink, loginUrl) => {
  const user  = await User.findOne({activationLink});
  console.log(initialPassword);
    if(!user){
        const error = new Error('Incorrect activation link!');
        error.statusCode = 406;
        throw error;
    }
    user.isActivated = true;
    const savedUser = await user.save();
    const mailOutput = signupEmail(savedUser.name, savedUser.email, initialPassword, loginUrl);
    const mailOptions = {
        from: process.env.EMAIL_UKR_NET,
        to: savedUser.email,
        subject: `Welcome ${savedUser.name}`,
        text: 'Have You just sign up?',
        html: mailOutput,
    };
    sendEmail(savedUser.email, mailOptions);
    initialPassword = '';
    return savedUser;
};

exports.refresh = async (refreshToken) => {
    if(!refreshToken){
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    const userData = validateRefreshToken(refreshToken);
    const tokenFromDB = await findToken(refreshToken);

    if(!userData || !tokenFromDB){
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    const user = await User.findById(userData.userId)

    const tokens = generateToken({
        email: user.email,
        userId: user._id.toString(),
        isActivated: user.isActivated
    });

    await saveToken(user._id, tokens.refreshToken);
    return {...tokens, user}
};

exports.signupUser = signupUser;