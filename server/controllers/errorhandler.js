module.exports = function(err, res, msg) {
    if(err) {
        console.log(msg, err);
        res.status(500).send({
            message: msg,
            error: err
        });
        return true;
    }
    return false;
};
