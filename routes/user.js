const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');
const User = require('../models/User');


const router = express.Router();

//
router.get('/image/:imageKey',
    // isAuth,
    userController.getImage);

router.post('/image',
    // isAuth,
    userController.postImage);

router.put('/image',
    // isAuth,
    userController.putImage);

router.delete('/image',
    // isAuth,
    userController.deleteImage);

module.exports = router;


