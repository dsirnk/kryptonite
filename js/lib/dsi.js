var _moduleName = 'dsi',
	defaults = {
		_user: 'dsirnk',
		symbol: {
			dir: '+ ',
			file: '| '
		},
		color: {
			dir: 'blue',
			file: 'white'
		},
		separator: '-',
		bullet: '-> ',
		separatorLen: 100
	},
	util = require('util'),
	colors = require('colors'),
	fs = require('fs'),
	mkdirp = require('mkdirp');

var dsi = module.exports = function(options) {
	this._name = _moduleName;
	this._defaults = defaults;
	this.options = this.extend({}, defaults, options);
	this.init();
}

dsi.prototype = {
	init: function () {
	},
	extend: function(target, defaults, src) {
		src = typeof src === 'object' ? src : {};
		for(var key in defaults)
			target[key] = src.hasOwnProperty(key) ? src[key] : defaults[key];
		return target;
	},
	log: function(cmd, colorize) {
		/*-- if object color it --*
		if(typeof cmd === "object") util.inspect(cmd, true, null, true);
		/*-- --*/
		console.log(cmd);
	},
	logBul: function(cmd) { this.log(this.options.bullet + cmd); },
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
			file.name[this.options.color[type]]
		);
	},
	dir: function(cmd) { console.dir(cmd); },
	mkdir: function(path) {
		var self = this;
		mkdirp(path, function(err) {
			if (err) console.error((err).red);
			else self.log('Created Directory: '.yellow + (path).green);
		})
	},
	mkfile: function(path) {
		fs.createWriteStream(path);
		this.log('Created File: '.yellow + (path).green);
	}
}