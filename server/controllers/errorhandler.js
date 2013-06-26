module.exports = function(err, res, msg) {
    if(err) {
        if(err.name == 'ValidationError') {
            res.status(400).send(err);
        } else {
            console.log(msg, err);
            res.status(500).send({
                message: msg,
                error: err
            });
        }
        return true;
    }
    return false;
};
