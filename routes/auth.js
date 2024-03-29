const Router = require('express').Router;
const {body} = require('express-validator');

const User = require('../models/User');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/isAuth');

const router = new Router();

//POST /auth/signup
router.post('/signup', [
    body('email', 'Please enter a valid Email!')
        .isEmail()
        // .custom((value, {req}) => {
        //     return User.findOne({email: value})
        //         .then(userDoc => {
        //             if(userDoc){
        //                 return Promise.reject('Email already exists!');
        //                 // throw new Error('Email already exists!');
        //
        //             }
        //         })
        // })
        .normalizeEmail(),
    body('password',
        `Password is too weak! Password should contain at least one letter,
         one capital letter, one number, one symbol and be at least 8 characters long`)
        .trim()
        .isStrongPassword(),
    body('confirmPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Passwords have to match!')
            }
            return true
        }),
    // body('name')
    //     .trim()
    //     .not()
    //     .isEmpty()
], authController.signup);

//POST /auth/login
router.post('/login', authController.login);

//POST /auth/reset
router.post('/reset', body('email', 'Please enter a valid Email!').isEmail(), authController.resetRequest);

//PATCH /auth/reset/ (token sent via body)
router.patch('/reset',
    body('password', `Password is too weak! Password should contain at least one letter,
    one capital letter, one number, one symbol and be at least 8 characters long`)
        .trim()
        .isStrongPassword(),
    authController.resetPassword);

router.post('/logout', authController.logout);
router.get('/activate/:link', authController.activateEmail);
router.get('/refresh', authController.refreshToken);
router.get('/userName', isAuth, authController.getUserName);


module.exports = router;