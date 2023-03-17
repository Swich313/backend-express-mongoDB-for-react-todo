const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv/config');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_BUCKET_ACCESSKEYID;
const secretAccessKey = process.env.AWS_BUCKET_SECRETACCESSKEY;
const bucketUser = process.env.AWS_BUCKET_USER;
const bucketPass= process.env.AWS_BUCKET_USER_CONSOLE_PASS;
const bucketConsoleSigninUrl = process.env.AWS_BUCKET_CONSOLE_SIGNIN_URL;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

//uploads a file to s3
const uploadFile = file => {
        const fileStream = fs.createReadStream(file.path);

        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: file.filename
        }

        return s3.upload(uploadParams).promise();
    };

//downloads a file from s3
const getFileStream = imageUrl => {
    const downloadParams = {
        Key: imageUrl,
        Bucket: bucketName
    };

    return s3.getObject(downloadParams).createReadStream();
};

const deleteFile = imageUrl => {
    const deleteParams = {
        Key: imageUrl,
        Bucket: bucketName
    };

    return s3.deleteObject(deleteParams, function (err, data) {
        if(err) console.log(err, err.stack);
        else console.log(data)
    });
};

exports.deleteImage = deleteFile;
exports.uploadImage = uploadFile;
exports.getImageStream = getFileStream;