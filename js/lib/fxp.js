var _moduleName = 'fxp',
	_defaults = {
		prompt: {
			host: {
				description: 'Hostname or IP address of the server.',
				// pattern: /^(ftp(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/,
				message: 'Please enter a valid host address',
				required: true
			},
			user: {
				description: 'Username for authentication.',
				message: 'Please enter a valid user/username',
				required: true
			},
			password: {
				description: 'Password for authentication.',
				hidden: true,
				required: true
			}
		},
		onReady: function() {}
	},
	ftp = require('jsftp'),
	dsi = require('./dsi'),
	z = new dsi();

var fxp = module.exports = function(options) {
	this._name = _moduleName;
	this._defaults = _defaults;
	this.options = z.extend(_defaults, options);
	this.init();
}

fxp.prototype = {
	init: function() {
		var self = this;

		/*==========  Removing prompts that aren't needed e.g. if the password is not provided  ==========*/
		for (prop in self.options.prompt) {
			if (self.options.hasOwnProperty(prop)) {
				self._defaults.prompt[prop].default = self.options[prop]
				delete  self.options.prompt[prop];
			}
		}

		/*==========  Prompt for remaining configuration  ==========*/
		z.prompt(self.options.prompt, function (result) {
			self.options = z.extend(self.options, result);

			/*==========  Connect using the configuration  ==========*/
			self.ftpConnnect({
				host: self.options.host,
				user: self.options.user,
				password: self.options.password
			});
		});
	},
	ftpConnnect: function(config) {
		var self = this;

		self.ftpC = new ftp(config);
		/*==========  Authorization  ==========*/
		self.ftpC.auth(config.user, config.password, function (err) {
			if (err) { z.logErr('Authentication ' + err); return; }
			z.logV('Successully Connected to ' + config.host);
			self.ftpC.keepAlive();
			/*==========  Calls the custom onReady function  ==========*/
			self.options.onReady();
		});
	},
}