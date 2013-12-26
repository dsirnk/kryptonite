var moduleName = 'fxp',
	defaults = {
		host: 'localhost',
		user: '',
		password: '',
		onReady: undefined
	},
	myPrompt = require("prompt"),
	ftp = require('ftp'),
	dsi = require('./dsi'),
	z = new dsi();

var fxp = module.exports = function(options) {
	this._name = moduleName;
	this._defaults = defaults;
	this.options = z.extend({}, defaults, options);
	this.ftpC = new ftp(),
	this._schema = {
		properties: {
			host: {
				description: 'The hostname or IP address of the FTP server.',
				// pattern: /^(ftp(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/,
				message: 'Please enter a valid host address',
				default: this.options.host
			},
			user: {
				description: 'Username for authentication.',
				message: 'Please enter a valid user/username',
				default: this.options.user
			},
			password: {
				description: 'Password for authentication.',
				hidden: true,
				default: this.options.password
			}
		}
	};
	this.init();
}

fxp.prototype = {
	init: function() {
		this.config();
	},
	config: function() {
		var self = this;
		myPrompt.start();

		myPrompt.get(this._schema, function (err, result) {
			if (err) { z.log(err); }
			self.ftpConnnect(result);
		});
	},
	ftpConnnect: function(config) {
		var self = this;

		self.ftpC.connect(config);
		self.ftpC.on('connect', function() { z.log('Connection :: connect'); });
		self.ftpC.on('ready', self.options.onReady);
		self.ftpC.on('error', function(err) { z.log('Connection :: error :: ' + err); });
		self.ftpC.on('end', function() { z.log('Connection :: end'); });
		self.ftpC.on('close', function(had_error) { z.log('Connection :: close'); });
	}
}