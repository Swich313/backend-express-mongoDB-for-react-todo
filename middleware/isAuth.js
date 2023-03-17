const jwt = require('jsonwebtoken');
require('dotenv/config');

const {validateAccessToken} = require('../services/tokenService');

module.exports = (req, res, next) => {
  //  Don't work with Postman
  // const authHeader = req.header.authorization;

    const authHeader = req.get('Authorization');
    console.log({authHeader});
  if(!authHeader) {
      const error = new Error('No Header');
      error.statusCode = 401;
      throw error;
  }
  const accessToken = authHeader.split(' ')[1];
  // let decodedToken;
  try {
      const userData = validateAccessToken(accessToken, process.env.JWT_ACCESS_SECRET);
      // decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if(!userData){
          const error = new Error('Not authenticated!');
          error.statusCode = 401;
          // return Promise.reject(error)
          throw error;
      }
      req.userId = userData.userId;
      next();
  } catch (err) {
      if(!err.statusCode) {
          err.statusCode = 500;
      }
      throw err;
  }
};