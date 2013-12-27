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
// 	firebaseRoot.push({aes: (options.encrypt ? krypto.enKrypt : krypto.deKrypt)(options.value, options.password),
// 		passwordHint: options.passwordHint});
// }

fx = new fxp({
	host: my.websites.themobilestore.host,
	user: my.websites.themobilestore.user,
	password: 'hetu2100',
	onReady: function() {
		var ftpList = function(dir) {
			var struct = {};
			fx.ftpC.ls(dir, function(err, list) {
				if (err) z.logErr(err);

				//*-- async and lists but break at unknown --*/
				/********************************************/

				async.each(
					list,
					function(file, callback) {
						var path = dir + file.name;
						var destPath = dest + path;
						z.log(Array(dir.split('/').length).join('\t'), {cont: true});
						var isDir = file.type === 1;
						z.ls(file, isDir);
						if(isDir) {
							ftpList(path + '/');
							z.mkdir(destPath);
						} else {
							// fx.ftpC.get(path, destPath, function(err) {
							// 	if (err) throw err;
							// });
						}
						callback();
					},
					function(err) {
						if(err) z.logErr(err);
						z.logD('Iterating done');
					}
				);

				//*-- folder structure to json --*/
				/********************************/

				// list.forEach(function(file) {
				// 	var info = {
				// 			path: dir + file.name,
				// 			name: file.name
				// 		},
				// 		isDir = file.type === 1;

				// })

				// function dirTree(dir) {

				// 	if (stats.isDirectory()) {
				// 		info.type = "folder";
				// 		info.children = fs.readdirSync(filename).map(function(child) {
				// 			return dirTree(filename + '/' + child);
				// 		});
				// 	} else {
				// 		// Assuming it's a file. In real life it could be a symlink or
				// 		// something else!
				// 		info.type = "file";
				// 	}

				// 	return info;
				// }

				// if (module.parent == undefined) {
				// 	// node dirTree.js ~/foo/bar
				// 	var util = require('util');
				// 	console.log(util.inspect(dirTree(process.argv[2]), false, null));
				// }

				//*-- tried to merge above two --*/
				/********************************/

				// list.forEach(function(file) {
				// 	var path = dir + file.name,
				// 		destPath = dest + path,
				// 		isDir = file.type === 1;
				// 	z.ls(file, {isDir: isDir, path: dir});
				// 	struct[file.name]
				// 		= isDir
				// 		? ftpList(path + '/')
				// 		: '';
				// 		// : fx.getFileContent(path);

				// 	// z.logD(file.name + ' : ' + struct[file.name]);
				// 	// firebaseRoot.push(struct[file.name]);
				// });
			});
			return struct;
		};
		ftpList('.data/');
	}
})