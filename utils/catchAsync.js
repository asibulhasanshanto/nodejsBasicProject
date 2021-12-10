//catches errors of async functions and sends to global error handler
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
