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
		for (prop in destination) {
			if(typeof destination[prop] === 'function')
				target[prop] = destination[prop];
		};

		/*==========  Recursively merge source into destination and output on target  ==========*/
		for (prop in source) {
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
		// prmpt.delimiter = ':';

		prmpt.start();
		prmpt.get(schema, function (err, result) {
			if (err) self.log(err.alert);
			callback(result);
		});
	},
	log: function(cmd, options) {
		options = options || {cont: false};
		if (options.cont) process.stdout.write(cmd);
		else console.log(cmd);
	},
	logO: function(cmd) {
		this.log(cmd.toString().data);
	},
	logErr: function(cmd) {
		this.log(cmd.toString().alert);
	},
	logV: function(cmd) {
		if(this.options._verbose) this.log(cmd.toString().info);
	},
	logD: function(cmd) {
		if(this.options._verbose === 'debug') this.log(cmd.toString().info.log);
	},
	logBul: function(cmd) { this.log(this.options.bullet.intro + cmd); },
	logDash: function() {
		this.log(
			Array(this.options.separatorLen)
				.join(this.options.separator)
		);
	},
	ls: function(file, options) {
		options = this.extend({isDir: false, path:''}, options);
		type = options.isDir ? 'dir' : 'file';
		this.log(
			Array(options.path.split('/').length).join('\t') +
			this.options.symbol[type] +
			file.name[type]
		);
	},
	dir: function(cmd) { console.dir(cmd); },
	mkdir: function(path) {
		var self = this;
		mkdirp(path, function(err) {
			if (err) console.error((err).red);
			else self.logV('Created '.info + 'Directory: '.dir + path.data);
		})
	},
	mkfile: function(path) {
		var self = this,
			writeStream = fs.createWriteStream(path);
		writeStream.on('close', function() {
			self.logV('Created '.info + 'File: '.file + path.data);
		});
		return writeStream;
	}
}