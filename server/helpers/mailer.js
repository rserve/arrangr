var Mandrill = require('mandrill-api').Mandrill;
var mandrill = new Mandrill();
var env = process.env.NODE_ENV;

function getInvitationICal(user, group, groupCreator) {

	/*jslint newcap:true */
	var iCalEvent = require('icalevent');
	var event = new iCalEvent();
	var summary = group.name + (group.description ? '-' + group.description : '');

	event.set('summary', summary);
	event.set('offset', new Date().getTimezoneOffset());
	event.set('start', group.startDate.toString());

	// 2 hours
	var endDate = new Date(group.startDate);
	endDate.setHours(endDate.getHours() + 2);
	event.set('end', endDate.toString());

	event.set('url', 'http://arran.gr/groups/' + group.key);

	event.set('organizer', {name: groupCreator.name || groupCreator.email, email: groupCreator.email});

	/*console.log('iCal for invitiation:');
	 console.log('----------------------');
	 console.log('ical:', event.toFile());
	 console.log('----------------------');*/
	return event.toFile();
}
var mailer = {
	sendMail: function (message) {
		mandrill.messages.send({ message: message }, function (res) {
			//        console.log(res);
		}, function (err) {
			console.log('Error sending mail', err);
		});
	},

	/* jshint camelcase: false */
	sendRegistrationMail: function (user) {
		mandrill.messages.sendTemplate({
			template_name: 'registration',
			template_content: [],
			message: {
				to: [
					{
						email: user.email
					}
				],
				global_merge_vars: [
					{
						name: 'LINK',
						content: 'http://arran.gr/password/' + user.verificationHash
					}
				],

			}
		}, function (res) {
//            console.log(res);
		}, function (err) {
			console.log('Error sending registration mail', err);
		});
	},

	sendInvitationMail: function (user, group, groupCreator) {

		var iCalString = getInvitationICal(user, group, groupCreator);
		var inviteEncoded = new Buffer(iCalString, 'utf8').toString('base64');

		/*

		TODO de-comment the one below to send invite with iCal
		but we need different template


		mandrill.messages.sendTemplate({
			template_name: 'registration',
			template_content: [
				{
					name: "password",
					content: "Your password is: <b>" + user.password + "</b>"
				}
			],
			message: {
				to: [
					{
						email: user.email
					}
				],
				global_merge_vars: [
					{
						name: 'VERIFYLINK',
						content: 'http://arran.gr/verify/' + user.verificationHash
					}
				],
				"attachments": [
					{
						"type": "text/calendar",
						"name": "invite.ics",
						"content": inviteEncoded
					}
				]

			}
		}, function (res) {
//            console.log(res);
		}, function (err) {
			console.log('Error sending registration mail', err);
		});*/
    },

	sendLostPasswordMail: function(user) {
		mandrill.messages.sendTemplate({
			template_name: 'password-reset',
			template_content: [],
			message: {
				to: [
					{
						email: user.email
					}
				],
				global_merge_vars: [
					{
						name: 'LINK',
						content: 'http://arran.gr/password/' + user.verificationHash
					}
				]
			}
		}, function (res) {
//            console.log(res);
		}, function (err) {
			console.log('Error sending registration mail', err);
		});
	}
};

module.exports = mailer;