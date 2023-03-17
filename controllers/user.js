const mongoose = require('mongoose');

const User = require('../models/User');
const Image = require('../models/Image');
const {uploadImage, getImageStream, deleteImage} = require('../utils/s3');
const {deleteFile} = require('../utils/deleteFile');

exports.getImage = (req, res, next) => {
    const imageKey = req.params.imageKey;
    const readStream = getImageStream(imageKey);
    readStream.pipe(res);
};

exports.postImage = async (req, res, next) => {
    if(!req.file) {
        const error = new Error('Image not found');
        error.statusCode = 422;
        throw error;
    }
    const image = req.file;
    // const imagePath = req.file.path.replace("\\", "/");


    const awsImage = await uploadImage(image);
    const awsImagePath = awsImage.Key;

    try {
    const awsImage = await uploadImage(image);
    const awsImagePath = awsImage.Key;
        console.log(image)

        if(awsImagePath) {

            deleteFile(image.path);
        }
        const userImage = await new Image({
            imageUrl: awsImagePath
        });
        await userImage.save();
        res.status(200).json({message: 'Image uploaded successfully', imageUrl: userImage.imageUrl});
    } catch (err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.putImage = (req, res, next) => {

};

exports.deleteImage = (req, res, next) => {

};