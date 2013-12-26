var util = require('util'),
	colors = require('colors'),
	my = require('../../config.json');

var dsi = module.exports = function() {
	var self = this;

	this.user = my.user;
	this.dashLen = my.dashLen;
}

dsi.prototype.log = function(cmd, colorize) {
	/*-- if object color it --*
	if(typeof cmd === "object") util.inspect(cmd, true, null, true);
	/*-- --*/
	console.log(cmd);
};

dsi.prototype.logBul = function(cmd) { this.log('-> ' + cmd); };
dsi.prototype.logDash = function(dashLen) { this.log(Array(dashLen || this.dashLen).join('-')); };
dsi.prototype.dir = function(cmd) { console.dir(cmd); };