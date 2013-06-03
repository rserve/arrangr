module.exports = function (app) {

    // user routes
    var groups = require('../controllers/groups');
    app.get('/api/groups', groups.findAll);
    app.get('/api/groups/:key', groups.findByKey);
    app.post('/api/groups', groups.create);
    app.put('/api/groups/:key', groups.update);
    app.delete('/api/groups/:key', groups.delete);
};