exports.removeHiddenProperties = function (toDelete, ret) {
    if(!(toDelete instanceof Array)) {
        ret = toDelete;
        toDelete = [];
    }

    for(var prop in ret) {
        if(prop.indexOf('_') === 0) {
            toDelete.push(prop);
        }
    }

    toDelete.forEach(function (prop) {
        delete ret[prop];
    });
};