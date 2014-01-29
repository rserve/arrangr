var Mandrill = require('mandrill-api').Mandrill;
var mandrill = new Mandrill();
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];

var baseUrl = 'http://' + config.host;
if(config.port != 80) {
	baseUrl += ':' + config.port;
}

function getInvitationICal(user, group, groupCreator) {

	/*jslint newcap:true */
	var iCalEvent = require('icalevent');
	var event = new iCalEvent();
	var summary = group.name + (group.description ? '-' + group.description : '');

	event.set('summary', summary);
	//var timezoneOffset = new Date().getTimezoneOffset();
	var timezoneOffset = -60; // hack to work with server timezone (to get it to swedish times)
	event.set('offset', timezoneOffset);
	event.set('start', group.startDate.toString());

	var endDate = new Date(group.startDate);
	endDate.setHours(endDate.getHours() + 1);
	event.set('end', endDate.toString());

	event.set('url', baseUrl + '/groups/' + group.key);

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
						content: baseUrl + '/password/' + user.verificationHash
					}
				]
			}
		}, function (res) {
//            console.log(res);
		}, function (err) {
			console.log('Error sending registration mail', err);
		});
	},

	sendInvitationMail: function (user, group, inviter) {

		var iCalString = getInvitationICal(user, group, inviter);
		var inviteEncoded = new Buffer(iCalString, 'utf8').toString('base64');

		mandrill.messages.sendTemplate({
			template_name: 'invite',
			template_content: [],
			message: {
				to: [
					{
						email: user.email
					}
				],
				subject: group.name,
				global_merge_vars: [
					{
						name: 'LINK',
						content: user.verified? baseUrl + '/groups/' + group.key : baseUrl + '/password/' + user.verificationHash
					},
					{
						name: 'INVITER',
						content: inviter.name || inviter.email
					},
					{
						name: 'MEETUP',
						content: group.name
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
			console.log('Error sending invitation mail', err);
		});
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
	},

	sendReminderMail: function(member, group) {
		mandrill.messages.sendTemplate({
			template_name: 'reminder',
			template_content: [],
			message: {
				to: [
					{
						email: member.user.email
					}
				],
				subject: group.name,
				global_merge_vars: [
					{
						name: 'LINK',
						content: baseUrl + '/groups/' + group.key + (member._hash ? ('/' + member._hash) : '')
					},
					{
						name: 'MEETUP',
						content: group.name
					}
				]
			}
		}, function (res) {
//            console.log(res);
		}, function (err) {
			console.log('Error sending reminder mail', err);
		});
	},

	sendStatusMail: function(member, group) {
		var participants = { 'Yes': [], 'Maybe': [], 'No': []};

		group.members.forEach(function(member) {
			if(member.status) {
				participants[member.status].push(member.user.name || member.user.email);
			}
		});

		mandrill.messages.sendTemplate({
			template_name: 'status',
			template_content: [{
				name: "yesParticipants",
				content: participants['Yes'].join(', ') || 'None'
			},{
				name: "maybeParticipants",
				content: participants['Maybe'].join(', ') || 'None'
			},{
				name: "noParticipants",
				content: participants['No'].join(', ') || 'None'
			}],
			message: {
				to: [
					{
						email: member.user.email
					}
				],
				subject: group.name,
				global_merge_vars: [
					{
						name: 'LINK',
						content: baseUrl + '/groups/' + group.key + (member._hash ? ('/' + member._hash) : '')
					},
					{
						name: 'MEETUP',
						content: group.name
					},
					{
						name: 'TOTAL',
						content: group.members.length
					},
					{
						name: 'YES',
						content: group.statusCount('Yes')
					},
					{
						name: 'MAYBE',
						content: group.statusCount('Maybe')
					}
				]
			}
		}, function (res) {
//            console.log(res);
		}, function (err) {
			console.log('Error sending status mail', err);
		});
	}
};

module.exports = mailer;