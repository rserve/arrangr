var SparkPost = require('sparkpost');
var sp = new SparkPost();
var env = process.env.NODE_ENV || 'development';
var config = require('../config/config')[env];
var moment = require('moment');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var templateDir = path.join(__dirname, '..', 'mail-templates');

var defaultFrom = { "name" : "Arran.gr", "email" : "no-reply@arran.gr" };

moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday at] HH:mm',
        sameDay : '[Today at] HH:mm',
        nextDay : '[Tomorrow at] HH:mm',
        lastWeek : '[last] dddd [at] HH:mm',
        nextWeek : 'dddd [at] HH:mm',
        sameElse : 'D/M YYYY'
    }
});

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
//	var timezoneOffset = -60; // hack to work with server timezone (to get it to swedish times)
//	event.set('offset', timezoneOffset);
	event.set('start', group.startDate.toString());
	event.set('end', group.endDate.toString());

	event.set('url', baseUrl + '/groups/' + group.key);

	event.set('organizer', {name: groupCreator.name || groupCreator.email, email: groupCreator.email});

	/*console.log('iCal for invitiation:');
	 console.log('----------------------');
	 console.log('ical:', event.toFile());
	 console.log('----------------------');*/
	return event.toFile();
}
var mailer = {
	/* jshint camelcase: false */
	sendRegistrationMail: function (user) {
		var data = {
			link: baseUrl + '/password/' + user.verificationHash
		};

		var mail = new EmailTemplate(path.join(templateDir, 'registration'));

		mail.render(data, function (err, result) {
			if(err) {
				console.log('Error rendering email', err);
				return;
			}

			sp.transmissions.send({
				transmissionBody: {
					content: {
						from : defaultFrom,
						subject: 'Welcome to Arran.gr',
						html: result.html,
						text: result.text
					},
					recipients: [
						{address: user.email}
					]
				}
			}, function(err, res) {
				if (err) {
					console.log('Error sending registration mail', err);
				}
			});
		});
	},

	sendInvitationMail: function (user, group, inviter) {

		//var iCalString = getInvitationICal(user, group, inviter);
		//var inviteEncoded = new Buffer(iCalString, 'utf8').toString('base64');

		var data = {
			link: user.verified? baseUrl + '/groups/' + group.key : baseUrl + '/password/' + user.verificationHash,
			inviter: inviter.name || inviter.email,
			meetup: group.name
		};

		var mail = new EmailTemplate(path.join(templateDir, 'invitation'));

		mail.render(data, function (err, result) {
			if(err) {
				console.log('Error rendering email', err);
				return;
			}

			sp.transmissions.send({
				transmissionBody: {
					content: {
						from : defaultFrom,
						subject: group.name,
						html: result.html,
						text: result.text
					},
					recipients: [
						{address: user.email}
					]
				}
			}, function(err, res) {
				if (err) {
					console.log('Error sending invitation mail', err);
				}
			});
		});
    },

	sendLostPasswordMail: function(user) {
		var data = {
			link: 'http://arran.gr/password/' + user.verificationHash
		};

		var mail = new EmailTemplate(path.join(templateDir, 'password-reset'));

		mail.render(data, function (err, result) {
			if(err) {
				console.log('Error rendering email', err);
				return;
			}

			sp.transmissions.send({
				transmissionBody: {
					content: {
						from : defaultFrom,
						subject: 'Password reset',
						html: result.html,
						text: result.text
					},
					recipients: [
						{address: user.email}
					]
				}
			}, function(err, res) {
				if (err) {
					console.log('Error sending password reset mail', err);
				}
			});
		});
	},

	sendReminderMail: function(member, group) {
		var data = {
			link: baseUrl + '/groups/' + group.key + (member._hash ? ('/' + member._hash) : ''),
			date: moment(group.startDate).calendar() + ' for ' + moment.duration(moment(group.endDate).diff(group.startDate)).humanize(),
			meetup: group.name
		};

		var mail = new EmailTemplate(path.join(templateDir, 'reminder'));

		mail.render(data, function (err, result) {
			if(err) {
				console.log('Error rendering email', err);
				return;
			}

			sp.transmissions.send({
				transmissionBody: {
					content: {
						from : defaultFrom,
						subject: group.name,
						html: result.html,
						text: result.text
					},
					recipients: [
						{address: member.user.email}
					]
				}
			}, function(err, res) {
				if (err) {
					console.log('Error sending reminder mail', err);
				}
			});
		});
	},

	sendStatusMail: function(member, group) {
		var participants = { 'Yes': [], 'Maybe': [], 'No': []};

		group.members.forEach(function(member) {
			if(member.status) {
				participants[member.status].push(member.user.name || member.user.email);
			}
		});

		var data = {
			yesParticipants: participants['Yes'].join(', ') || 'None',
			maybeParticipants: participants['Maybe'].join(', ') || 'None',
			noParticipants: participants['No'].join(', ') || 'None',
			link: baseUrl + '/groups/' + group.key + (member._hash ? ('/' + member._hash) : ''),
			meetup: group.name,
			total: group.members.length,
			yes: group.statusCount('Yes'),
			maybe: group.statusCount('Maybe')
		};

		var mail = new EmailTemplate(path.join(templateDir, 'status'));

		mail.render(data, function (err, result) {
			if(err) {
				console.log('Error rendering email', err);
				return;
			}

			sp.transmissions.send({
				transmissionBody: {
					content: {
						from : defaultFrom,
						subject: group.name,
						html: result.html,
						text: result.text
					},
					recipients: [
						{address: member.user.email}
					]
				}
			}, function(err, res) {
				if (err) {
					console.log('Error sending status mail', err);
				}
			});
		});
	}
};

module.exports = mailer;