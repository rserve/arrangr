var Mandrill = require('mandrill-api').Mandrill;
var mandrill = new Mandrill();

exports.sendMail = function (message) {
    mandrill.messages.send( { message: message }, function (res) {
//        console.log(res);
    }, function (err) {
        console.log('Error sending mail', err);
    });
};

/* jshint camelcase: false */
exports.sendRegistrationMail = function(user) {
    mandrill.messages.sendTemplate({
        template_name: 'registration',
        template_content: [{
            name: "password",
            content: "Your password is: <b>"+user.password+"</b>"
        }],
        message: {
            to: [{
                email: user.email
            }],
            global_merge_vars: [{
                name: 'VERIFYLINK',
                content: 'http://arran.gr/verify/'+user.verificationHash
            }]
        }
    }, function (res) {
        console.log(res);
    }, function (err) {
        console.log('Error sending registration mail', err);
    });
};
