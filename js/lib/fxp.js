var _moduleName = 'fxp',
	_defaults = {
		host: 'localhost',
		user: '',
		password: '',
		prompt: {
			host: {
				description: 'Hostname or IP address of the server.',
				// pattern: /^(ftp(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/,
				message: 'Please enter a valid host address',
			},
			user: {
				description: 'Username for authentication.',
				message: 'Please enter a valid user/username',
			},
			password: {
				description: 'Password for authentication.',
				hidden: true,
			}
		},
		onReady: undefined
	},
	ftp = require('ftp'),
	dsi = require('./dsi'),
	z = new dsi();

var fxp = module.exports = function(options) {
	this._name = _moduleName;
	this._defaults = _defaults;
	this.options = z.extend(_defaults, options);
	this.ftpC = new ftp();
	this.init();
}

fxp.prototype = {
	init: function() {
		this.options.prompt = z.extend(this.options.prompt, {
			host: { default: this.options.host },
			user: { default: this.options.user },
			password: { default: this.options.password }
		});
		this.config();
	},
	config: function() {
		var self = this;
		z.prompt(this.options.prompt, function (result) {
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