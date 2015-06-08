function deleteRecursive(data) {
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            if (property.indexOf('_') === 0) {
                delete data[property];
            } else {
                if (typeof data[property] === "object") {
                    deleteRecursive(data[property]);
                }
            }
        }
    }
}

exports.removeHiddenProperties = deleteRecursive;