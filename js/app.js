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
		var ftpList = function(dir) {
			/*==========  'struct' will store the folder structure  ==========*/
			var struct = {};

			/*==========  Create local folder  ==========*/
			z.mkdir(dest + dir);
			fx.ftpC.ls(dir, function(err, list) {
				z.logD('Iterating over ' + dir.dir);
				if (err) z.logErr(err);
				else async.each(
					list,
					function(file, callback) {
						var path = dir + file.name,
							destPath = dest + path,
							isDir = file.type === 1;
						/*==========  List files in tree  ==========*/
						z.ls(file, {isDir: isDir, path: dir});
						/*==========  Parse directory / file  ==========*/
						struct[file.name] = isDir
							? ftpList(path + '/')
							: fx.ftpProcessContent(path, destPath);
						callback();
					},
					function(err) {
						if(err) z.logErr(err);
						else z.logD('Iterating done ');
					}
				);
			});
			return struct;
		};
		ftpList('.data/');
	}
};
config = z.extend(config, my.websites.themobilestore);

var fx = new fxp(config);