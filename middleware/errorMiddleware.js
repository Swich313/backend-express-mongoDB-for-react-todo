module.exports = (error, req, res, next) => {
    console.log({errorFromErrorMiddleware: error, status: error.statusCode});
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
};