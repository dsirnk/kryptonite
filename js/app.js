var pkg = require("./package.json"),
	dsi = require("./lib/dsi"),
	my = require("../config.json"),
	krypto = require("./lib/krypto"),
	fxp = require("./lib/fxp"),
	async = require("async"),
	firebase = require('firebase'),
	firebaseRoot = new firebase(pkg.firebase + '/ftp'),
	dest = '',
	z = new dsi();

// krypt = new krypto();
// var fireBase = function(struct) {
// 	z.log('-> Firing value - ' + options.Krypted + ', hint: ' + options.passwordHint);
// 	firebaseRoot.push({
//		aes: (options.encrypt ? krypto.enKrypt : krypto.deKrypt)(options.value, options.password),
// 		passwordHint: options.passwordHint});
// }
var config = {
		onReady: function() {
			ftpList('.data/');
		}
	},
	config = z.extend(config, my.websites.themobilestore),
	fx = new fxp(config),
	ftpList = function(dir) {
		/*==========  'struct' will store the folder structure  ==========*/
		var struct = {};

		/*==========  Create local folder  ==========*/
		z.mkdir(dest + dir);
		fx.ftpC.ls(dir, function(err, list) {
			z.logD('Iterating over ' + dir.dir);
			if (err) z.logErr(err);
			list.forEach(function (file) {
				file.dir = dir;
				processFile.push(file, function(err) {
					if (err) z.logErr(err);
				});
			});
		});
		return struct;
	},
	processFile = async.queue(function(file, callback) {
		var path = file.dir + file.name,
			isDir = file.type === 1,
			callback = callback || function() {};

		/*==========  List files in tree  ==========*/
		z.ls(file, {isDir: isDir, path: file.dir});
		/*==========  Parse directory / file  ==========*/
		 var data = isDir
			? ftpList(path + '/')
			: '';
			// : fx.ftpProcessContent(path, dest + path);
		callback();
	}, 1);

processFile.drain = function() {
	z.logD('Iterating done');
}