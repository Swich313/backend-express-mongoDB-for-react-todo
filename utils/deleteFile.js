const fs = require('fs');

const deleteFile = filePath => {
    fs.unlink(filePath, err => {
        if (err) {
            throw (err);
        }
        console.log('File ' + filePath + ' deleted successfully!');
    })
};

exports.deleteFile = deleteFile;
