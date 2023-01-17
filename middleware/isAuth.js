const jwt = require('jsonwebtoken');
require('dotenv/config');

module.exports = (req, res, next) => {
  //  Don't work with Postman
  // const authHeader = req.header.authorization;

    const authHeader = req.get('Authorization');
    console.log(authHeader);
  if(!authHeader) {
      const error = new Error('No Header');
      error.statusCode = 401;
      throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
      err.statusCode = 500;
      throw err;
  }
    if(!decodedToken){
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};