var fs = require('fs'),
	dsi = require('./dsi'),
	my = require('../../config.json'),
	myPrompt = require("prompt"),
	z = new dsi();

var fxp = module.exports = function() {
	var self = this;

	this.schema = {
		properties: {
			host: {
				description: 'The hostname or IP address of the FTP server.',
				// pattern: /^(ftp(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/,
				message: 'Please enter a valid host address',
				default: my.websites.themobilestore.host
			},
			user: {
				description: 'Username for authentication.',
				message: 'Please enter a valid user/username',
				default: my.websites.themobilestore.user
			},
			password: {
				description: 'Password for authentication.',
				hidden: true
			}
		}
	};
	this.ftpConfig(this.ftpCon);
}

fxp.prototype.ftpConfig = function(callback) {
	myPrompt.start();
	myPrompt.get(this.schema, function (err, result) {
		if (err) { z.log(err); }
		callback(result);
	});
}

fxp.prototype.ftpCon = function(config) {
	var self = this,
		ftp = require('ftp'),
		ftpC = new ftp();

	ftpC.connect(config);
	// ftpC.on('connect', function() { z.log('Connection :: connect'); });
	ftpC.on('ready', function() {
		self.ftpReady(ftpC);
	});
	ftpC.on('error', function(err) { z.log('Connection :: error :: ' + err); });
	// ftpC.on('end', function() { z.log('Connection :: end'); });
	// ftpC.on('close', function(had_error) { z.log('Connection :: close'); });
}

fxp.prototype.ftpReady = function(ftpC) {
	console.log('hi');
};