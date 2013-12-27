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
		colors.setTheme(this.options.colors);
	},
	extend: function(destination, source) {
		var target = JSON.parse(JSON.stringify(destination));
		source = typeof source === 'object' ? source : {};
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				target[property] = destination[property] || {};
				target[property] = arguments.callee(destination[property], source[property]);
			} else {
				target[property] = source[property];
			}
		}
		return target;
	},
	prompt: function(properties, callback) {
		var self = this,
			schema = {properties: properties};
		prmpt.message = '';
		// prmpt.delimiter = ':';
		prmpt.start();
		prmpt.get(schema, function (err, result) {
			if (err) { self.log(err.alert); }
			callback(result);
		});
	},
	log: function(cmd) {
		console.log(cmd);
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
	ls: function(file) {
		var type = (file.type === 'd' ? 'dir' : 'file');
		this.log(
			this.options.symbol[type] +
			file.name[type]
		);
	},
	dir: function(cmd) { console.dir(cmd); },
	mkdir: function(path) {
		var self = this;
		mkdirp(path, function(err) {
			if (err) console.error((err).red);
			else self.logV('Created Directory: '.info + path.data);
		})
	},
	mkfile: function(path) {
		fs.createWriteStream(path);
		this.logV('Created File: '.info + path.data);
	}
}