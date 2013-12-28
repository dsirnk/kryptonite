var pkg = require("./package.json"),
	dsi = require("./lib/dsi"),
	my = require("../config.json"),
	krypto = require("./lib/krypto"),
	fxp = require("./lib/fxp"),
	async = require("async"),
	firebase = require('firebase'),
	firebaseRoot = new firebase(pkg.firebase + '/ftp'),
	dest = 'dest',
	z = new dsi();

// krypt = new krypto();
// var fireBase = function(struct) {
// 	z.log('-> Firing value - ' + options.Krypted + ', hint: ' + options.passwordHint);
// 	firebaseRoot.push({
//		aes: (options.encrypt ? krypto.enKrypt : krypto.deKrypt)(options.value, options.password),
// 		passwordHint: options.passwordHint});
// }
var config = z.extend({
		onReady: function() {
			ftpList('/.data/', function(err) {
				if (err) { z.logErr(err); }
			});
		}
	}, my.websites.themobilestore),
	ftp = new fxp(config).ftpC,
	ftpList = function(dir, callback) {
		/*==========  'struct' will store the folder structure  ==========*/
		var struct = {};

		/*==========  Create local folder  ==========*/
		if(dir[dir.length-1] !== '/') dir += '/';
		z.mkdir(dest + dir);
		ftp.ls(dir, function(err, list) {
			z.logD('Iterating over ' + dir.dir);
			if (err) { z.logErr(err); callback(err); }
			list.forEach(function (file) {
				var path = dir + file.name,
					isDir = file.type === 1;

				/*==========  List files in tree  ==========*/
				z.ls(file, {isDir: isDir, path: dir});
				/*==========  Parse directory / file  ==========*/
				struct[file.name] = (isDir ? ftpList : ftpGet)(path, callback);
			});
		});
		return struct;
	},
	ftpGet = function(path, callback) {
		var data = '';
		/*==========  Get Content of file 'path'  ==========*/
		// ftp.get(path, function(err, socket) {
		// 	if (err) { z.logErr('There was an error in the path.'); callback(err); }

		// 	socket.on("data", function(d) { data += d.toString(); });
		// 	socket.on("close", function(err) {
		// 		if (err) { z.logErr('There was an error retrieving the file.'); callback(err); }
		// 		z.mkfile(dest + path, data);
		// 		callback();
		// 	});
		// 	socket.resume();
		// });
		return data;
	};