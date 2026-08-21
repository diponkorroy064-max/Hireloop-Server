const logger = (req, res, next) => {
    console.log('logger middleware logged', req.params);
    next();
};

module.exports = logger;
