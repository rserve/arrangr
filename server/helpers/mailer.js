var Mandrill = require('mandrill-api').Mandrill;
var mandrill = new Mandrill();
var env = process.env.NODE_ENV;

exports.sendMail = function (message) {
    if(env != 'test') {
        mandrill.messages.send( { message: message }, function (res) {
    //        console.log(res);
        }, function (err) {
            console.log('Error sending mail', err);
        });
    }
};

/* jshint camelcase: false */
exports.sendRegistrationMail = function(user) {
    if(env != 'test') {
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
//            console.log(res);
        }, function (err) {
            console.log('Error sending registration mail', err);
        });
    }
};
