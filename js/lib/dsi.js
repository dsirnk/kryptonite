var _moduleName = 'dsi',
	_defaults = {
		_user: 'dsirnk',
		_verbose: 'debug', /* true, false or debug */
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
		separator: '-',
		bullet: '-> ',
		separatorLen: 100
	},
	util = require('util'),
	colors = require('colors'),
	prmpt = require("prompt"),
	fs = require('fs'),
	mkdirp = require('mkdirp');

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
	},
	extend: function(destination, source) {
		var target = JSON.parse(JSON.stringify(destination)),
			source = typeof source === 'object' ? source : {};

		/*==========  If destination contains functions and soruce doesn't, the functions are lost  ==========*/
		for (var prop in destination) {
			if(typeof destination[prop] === 'function')
				target[prop] = destination[prop];
		};

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
	prompt: function(properties, callback) {
		var self = this,
			schema = {properties: properties};

		/*==========  Customize Prompt  ==========*/
		prmpt.message = '';
		prmpt.delimiter = ':';

		prmpt.start();
		prmpt.get(schema, function (err, result) {
			if (err) { self.logErr(err); return; }
			callback(result);
		});
	},
	log: function(cmd, options) {
		/*==========  'cont' to log contuniously w/o line breaks  ==========*/
		var options = options || {type: typeof cmd},
			output = {
				default: function() {
					console.log(cmd);
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
	logErr: function(cmd) {
		this.log(cmd.toString().alert);
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
	depth: function(path) {
		return path.split('/').length;
	},
	/*==========  Log expandable dir on console  ==========*/
	dir: function(cmd) {
		console.dir(cmd);
	},
	/*==========  Log trace of variable  ==========*/
	trace: function(cmd) {
		console.trace(cmd);
	},
	/*==========  Create folder at 'path'  ==========*/
	mkdir: function(path, callback) {
		var self = this;

		mkdirp(path, function(err) {
			if (err) { self.logErr(err); return; }
			var logStr = 'Created '.info + 'Directory: '.dir + path.data;
			if(callback) callback(logStr);
			else self.logD(logStr);
		})
	},
	/*==========  Create File at 'path'  ==========*/
	mkfile: function(path, data, callback) {
		var self = this;

		fs.writeFile(path, data, function(err) {
			if(err) { self.logErr(err); return; }
			var logStr = 'Created '.info + 'File: '.file + path.data;
			if(callback) callback(logStr);
			else self.logD(logStr);
		});
	}
}