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
			ftpList('/.data/');
		}
	}, my.websites.themobilestore),
	x = new fxp(config),
	depth = 2,
	/*==========  'struct' will store the folder structure  ==========*/
	struct = [],
	ftpList = function(dir) {
		z.log(this);
		/*==========  Create local folder  ==========*/
		if(dir[dir.length-1] !== '/') dir += '/';

		z.mkdir(dest + dir, function() {
			if(depth === null || z.depth(dir) - 3 < depth) {
				z.logD('Iterating over ' + dir.dir);
				x.ftpC.ls(dir, function(err, list) {
					if (err) {
						z.logErr('The was an error while iterating over ' + dir.dir + ': ');
						z.log(err);
					}
					list.forEach(function (file, i) {
						var isDir = file.type === 1,
							path = dir + file.name + (isDir ? '/' : '');

						/*==========  List files in tree  ==========*/
						struct.push(path);
						// z.ls(file.name, {isDir: isDir, path: dir});
						/*==========  Parse directory / file  ==========*/
						(isDir ? ftpList : ftpGet)(path);
					});
				});
			};
		});

	},
	ftpGet = function(path) {
		var data = '';
		/*==========  Get Content of file 'path'  ==========*/
		z.logD('Parsing over ' + path.file);
		// fx = new fxp(config);
		x.ftpC.get(path, function(err, socket) {
			if (err) {
				z.logErr('There was an error while parsing over ' + path.file + ': ');
				z.log(err);
			}

			socket.on("data", function(d) { data += d.toString(); });
			socket.on("close", function(err) {
				if (err) {
					z.logErr('There was an error retrieving the file ' + path.file + ': ');
					z.log(err);
				}
				z.mkfile(dest + path, data);
			});
			socket.resume();
		});
		// fx.ftpC.destroy();
		return data;
	};