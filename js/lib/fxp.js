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

		self.ftpC = new ftp(config);
		self.ftpC.auth(self.options.user, self.options.password, function (err) {
			if (err) z.logErr('Authentication ' + err);
			else {
				z.logD('Successully Connected to ' + config.host);
				self.ftpC.keepAlive();
				self.options.onReady();
			};
		});
	},
	getFileContent: function(path) {
		fx.ftpC.get(path, function(err, socket) {
			if (err) z.logErr('There was an error in the path.');
			var content;
			socket.on("data", function(d) {
				content = d.toString();
				z.logD(path + ' : ' + content);
			});
			socket.on("close", function(hadErr) {
				if (hadErr)
					z.logErr('There was an error retrieving the file.');
			});
			socket.resume();
			return content;
		});
	}
}