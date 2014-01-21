var _moduleName = 'dsi',
	_defaults = {
		_user: 'dsirnk',
		_verbose: 'debug', /* true, false or debug */
		output: 'console',
		symbol: {
			dir: '+ ',
			file: '| '
		},
		colors: {
			log: 'inverse',
			info: 'yellow',
			alert: 'red',
			data: 'green',
			intro: 'grey',
			dir: 'cyan',
			file: 'blue',
			b: 'bold',
			i: 'italic',
			u: 'underline'
		},
		krypt: {
			key: 'imcentenn1al',
			algorithm: 'aes-256-cbc'
		},
		ftp: {
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
			}
		},
		separator: '-',
		bullet: '-> ',
		separatorLen: 100
	},
	_io,
	_log = [],
	colors = require('colors'),
	crypto = require('crypto'),
	express = require('express'),
	http = require('http'),
	jade = require('jade'),
	path = require('path'),
	prmpt = require('prompt'),
	fs = require('fs'),
	ftp = require('jsftp'),
	mkdirp = require('mkdirp'),
	util = require('util'),
	app = express();

var dsi = module.exports = function(options) {
	this._name = _moduleName;
	this._defaults = _defaults;
	this.options = this.extend(_defaults, options);
	this.init();
}

dsi.prototype = {
	init: function () {

		/*==========  Set color scheme  ==========*/
		colors.setTheme(this.options.colors);

		if(this.options.output === 'browser') {
			this.initBrowser(8000);
			colors.mode = this.options.output;
			// if (typeof console  != "undefined")
			// 	if (typeof console.log != 'undefined')
			// 		console.olog = console.log;
			// 	else
			// 		console.olog = function() {};

			// console.log = function(message) {
			// 	console.olog(message);
			// 	$('#debugDiv').append('<p>' + message + '</p>');
			// };
			// console.error = console.debug = console.info =  console.log
		}

	},
	initBrowser: function(port) {

		// all environments
		app.set('port', process.env.PORT || port);
		app.set('views', 'tpl');
		app.set('view engine', 'jade');
		app.engine('jade', jade.__express);
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.urlencoded());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(express.static('public'));

		// development only
		if ('development' == app.get('env')) {
		  app.use(express.errorHandler());
		}

		var io = require('socket.io').listen(app.listen(port));

		app.get('/', function (req, res) {
			res.render('dsi');
		});

		io.sockets.on('connection', function (socket) {
			_io = socket;
			socket.emit('greeting', { message: 'Welcome to DSI Logger' });
			socket.on('load', function (data) {
				socket.emit('message', { message: _log });
			});
		});
	},
	log: function(cmd, options) {
		/*==========  'cont' to log contuniously w/o line breaks  ==========*/
		var options = options || {type: typeof cmd},
			output = {
				default: function() {
					_log.push(cmd);
					if(_io) _io.emit('message', cmd);
					else console.log(cmd);
				},
				object: function() {
					console.log(util.inspect(cmd, { colors: true, showHidden: true, depth: null }));
				},
				cont: function() {
					process.stdout.write(cmd);
				}
			};

		if (output[options.type]) output[options.type]();
		else output['default']();
	},
	logW: function(cmd) {
		this.log(cmd, {'type': 'cont'});
	},
	/*==========  Log output  ==========*/
	logO: function(cmd) {
		this.log(cmd.toString().data);
	},
	/*==========  Log error  ==========*/
	logError: function(cmd) {
		this.log(cmd.toString().alert);
	},
	logErr: function(err, str) {
		this.logError(str || '');
		this.log(err);
	},
	/*==========  Log in a verbose mode, if '_defaults._verbose' is set to 'true' or 'debug'  ==========*/
	logV: function(cmd) {
		if(this.options._verbose) this.log(cmd.toString().info);
	},
	/*==========  Log in a debug mode, if '_defaults._verbose' is set to 'true'  ==========*/
	logD: function(cmd) {
		if(this.options._verbose === 'debug') this.log(cmd.toString().info.log);
	},
	/*==========  Log list  ==========*/
	logBul: function(cmd) {
		this.log(this.options.bullet.intro + cmd);
	},
	/*==========  Log a separator  ==========*/
	logDash: function(n) {
		this.log(
			Array(n || this.options.separatorLen)
				.join(this.options.separator)
		);
	},
	extend: function(destination, source) {
		var target = JSON.parse(JSON.stringify(destination)),
			source = typeof source === 'object' ? source : {};

		/*==========  If destination contains functions and soruce doesn't, the functions are lost  ==========*/
		// for (var prop in destination) {
		// 	if(typeof destination[prop] === 'function')
		// 		target[prop] = destination[prop];
		// };

		/*==========  Recursively merge source into destination and output on target  ==========*/
		for (var prop in source) {
			if (source[prop] && source[prop].constructor && source[prop].constructor === Object) {
				target[prop] = destination[prop] || {};
				target[prop] = arguments.callee(destination[prop], source[prop]);
			} else {
				target[prop] = source[prop];
			}
		}
		return target;
	},
	/*==========  Log tree of the folder structure  ==========*/
	ls: function(name, options) {
		var options = this.extend({isDir: false, path:''}, options),
			type = options.isDir ? 'dir' : 'file';
		this.log(
			Array(this.depth(options.path)).join('\t') +
			this.options.symbol[type] +
			name[type]
		);
	},
	/*==========  Log expandable dir on console  ==========*/
	dir: function(cmd) {
		console.dir(cmd);
	},
	depth: function(path) {
		return path.split('/').length;
	},
	/*==========  Log trace of variable  ==========*/
	trace: function(cmd) {
		console.trace(cmd);
	},
	/*==========  Create folder at 'path'  ==========*/
	mkdir: function(path, callback) {
		var self = this;

		mkdirp(path, function(err) {
			if (err) return self.logErr(err);
			var logStr = 'Created '.info + 'Directory: '.dir + path.data;
			if(callback) callback(logStr);
			else self.logD(logStr);
		})
	},
	/*==========  Create File at 'path'  ==========*/
	mkfile: function(path, data, callback) {
		var self = this;

		fs.writeFile(path, data, function(err) {
			if(err) return self.logErr(err);
			var logStr = 'Created '.info + 'File: '.file + path.data;
			if(callback) callback(logStr);
			else self.logD(logStr);
		});
	},
	/*==========  Create Encrypted File at 'path'  ==========*/
	mkencryptedfile: function(path, readStream, callback) {
		var self = this,
			useKey = function(keyObj) {
				var kryption = self.options.krypt['encryption'] !== undefined ? self.options.krypt.encryption : !path.match('\.dat$');
				path = kryption ? (path + '.dat') : path.replace('.dat','');

				for(var key in keyObj) break;
				key = keyObj[key];

				var keyBuf = new Buffer(key),
					writeStream = fs.createWriteStream(path);

				writeStream.on('error', function(err) {
					return self.logErr(err, 'While writing over ' + path.file);
				});

				var krypt = (kryption ? crypto.createCipher : crypto.createDecipher)(self.options.krypt.algorithm, keyBuf);

				readStream.on('data', function(data) {
					var buf = new Buffer(krypt.update(data), 'binary');
					writeStream.write(buf);
				});

				readStream.on('end', function() {
					var buf = new Buffer(krypt.final('binary'), 'binary');
					writeStream.write(buf);
					writeStream.end();
					writeStream.on('close', function() {
						var logStr = 'Created '.info + 'File: '.file + path.data;
						if(callback) callback(logStr);
						else self.logD(logStr);
					});
				});
				self.options.krypt = self.extend(self.options.krypt, keyObj);
				readStream.resume();
			}

		// krypt.algorithm = krypt.algorithm || self.get('algorithm');
		self.options.krypt['key'] !== undefined ? useKey(self.options.krypt) : self.get('key', {hidden:true}, useKey);
	},
	prompt: function(properties, callback) {
		var self = this,
			schema = {properties: properties};

		/*==========  Customize Prompt  ==========*/
		prmpt.message = '';
		prmpt.delimiter = ':';

		prmpt.start();
		prmpt.get(schema, function (err, result) {
			if (err) return self.logErr(err);
			callback(result);
		});
	},
	get: function(property, options, callback) {
		var self = this,
			prompt = {};

		options = options || {};
		callback = callback || function() {};

		if (typeof options === 'function') {
			callback = options;
			options = {};
		};

		if (typeof property === 'object') {
			prompt = property;
		} else {
			prompt[property] = options;
		};

		self.prompt(prompt, function(result) {
			callback(result[property] !== '' ? result : undefined);
		})
	},
	fxp: function(config, callback) {
		var self = this;

		/*==========  Merge given ftp config into default ftp config  ==========*/
		self.options.ftp = self.extend(self.options.ftp, config);

		/*==========  Removing prompts that aren't needed e.g. if the password is not provided  ==========*/
		for (var prop in self.options.ftp.prompt) {
			if (self.options.ftp.hasOwnProperty(prop)) {
				self._defaults.ftp.prompt[prop].default = self.options.ftp[prop]
				delete  self.options.ftp.prompt[prop];
			}
		}

		/*==========  Prompt for remaining configuration  ==========*/
		self.prompt(self.options.ftp.prompt, function (result) {
			self.options.ftp = self.extend(self.options.ftp, result);

			/*==========  Connect using the configuration  ==========*/
			self.ftpConnnect({
				host: self.options.ftp.host,
				user: self.options.ftp.user,
				password: self.options.ftp.password
			}, callback);
		});
	},
	ftpConnnect: function(config, callback) {
		var self = this;

		self.ftpC = new ftp(config);
		/*==========  Authorization  ==========*/
		self.ftpC.auth(config.user, config.password, function (err) {
			if (err) return self.logErr(err, 'While Authenticating');
			self.logV('Successully Connected to ' + config.host);
			callback();
		});
	},
}