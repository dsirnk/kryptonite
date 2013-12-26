var util = require('util'),
	colors = require('colors'),
	my = require('../../config.json');

var dsi = module.exports = function() {
	var self = this;

	this._user = my.user;
	this._dashLen = my.dashLen;
}

dsi.prototype = {
	log: function(cmd, colorize) {
		/*-- if object color it --*
		if(typeof cmd === "object") util.inspect(cmd, true, null, true);
		/*-- --*/
		console.log(cmd);
	},
	logBul: function(cmd) { this.log('-> ' + cmd); },
	logDash: function(dashLen) { this.log(Array(dashLen || this._dashLen).join('-')); },
	dir: function(cmd) { console.dir(cmd); },
	extend: function(target, defaults, options) {
		for(var key in defaults)
			target[key] = options.hasOwnProperty(key) ? options[key] : defaults[key];
		return target;
	}
}