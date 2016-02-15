var _moduleName = 'kryptFxp',
	_dest = 'dest',
	async = require('async'),
	dsi = require('./lib/dsi'),
	fxp = require('./lib/fxp'),
	my = require('../config.json'),
	pkg = require('./package.json'),
	z = new dsi({output:'browser'});

/*==========  FTP, file Xransfer Protocol to download and encrypt files  ==========*/
z.fxp(my.websites.themobilestore, function() {
	/*==========  Init  ==========*/
	ftpList('/');
});

var depth = 2,
	/*==========  'struct' will store the folder structure  ==========*/
	struct = [],
	ftpList = function(dir, callback) {
		callback = callback || function() {};

		/*==========  Create local folder  ==========*/
		if(dir[dir.length-1] !== '/') dir += '/';

		z.mkdir(_dest + dir, function(logStr) {
			if(depth === null || z.depth(dir) - 3 < depth) {

				z.logD('Iterating over ' + dir.dir);

				/*==========  Get list of the files and folders in 'dir'  ==========*/
				z.ftpC.ls(dir, function(err, list) {
					if (err) return z.logErr(err, 'While iterating over ' + dir.dir);

					list.forEach(function (file, i) {
						var isDir = file.type === 1,
							path = dir + file.name + (isDir ? '/' : '');

						/*==========  List files in tree  ==========*/
						struct.push(path);
						// z.ls(file.name, {isDir: isDir, path: dir});
						/*==========  Parse directory / file  ==========*/
						(isDir ? ftpList : ftpGet.push)(path, callback);
					});
				});

			};
		});

	},
	ftpGet = async.queue(function(path, callback) {
		callback = callback || function() {};

		z.logD('Parsing over ' + path.file);

		/*==========  Get Content of file 'path'  ==========*/
		z.ftpC.getGetSocket(path, function(err, socket) {
			if (err) return z.logErr(err, 'While parsing over ' + path.file);

			z.mkencryptedfile(_dest + path, socket, function(logStr) {
				z.logV(logStr);
				callback();
			});

		});
	/*==========  Queuing only 1 at a time because currently I'm not creating individual instance of ftpC  ==========*/
	}, 1);
