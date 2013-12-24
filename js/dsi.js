var util = require('util'),
	colors = require('colors'),
	config = require('../config.json');

var dsi = module.exports = function() {
	var self = this;
}

dsi.prototype.log = function(cmd, colorize) {
	/*-- if object color it --*
	if(typeof cmd === "object") util.inspect(cmd, true, null, true);
	/*-- --*/
	console.log(cmd);
};

dsi.prototype.logDash = function(dashLen) {
	dashLen = dashLen || config.dashLen;
	this.log(Array(dashLen).join('-'));
};

dsi.prototype.dir = function(cmd) { console.dir(cmd); };