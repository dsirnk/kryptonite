var pkg = require("./package.json"),
	dsi = require("./lib/dsi"),
	my = require("../config.json"),
	fs = require('fs'),
	crypto = require('crypto'),
	krypto = require("./lib/krypto"),
	fxp = require("./lib/fxp"),
	async = require("async"),
	firebase = require('firebase'),
	firebaseRoot = new firebase(pkg.firebase + '/ftp'),
	dest = 'dest',
	options = {
		password: {
			description: 'Your seceret passphrase',
			hidden: true
		}
	},
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
			z.prompt(options, function (result) {

				options = z.extend(options, result);

				/*==========  Cipher Data  ==========*/
				options.aes = crypto.createCipher('aes-256-cbc', options.password);

				/*==========  Init  ==========*/
				ftpList('/');
				// ftpGet.push('/1.html');
			});
		}
	}, my.websites.themobilestore),
	x = new fxp(config),
	depth = 2,
	/*==========  'struct' will store the folder structure  ==========*/
	struct = [],
	ftpList = function(dir, callback) {
		callback = callback || function() {};

		/*==========  Create local folder  ==========*/
		if(dir[dir.length-1] !== '/') dir += '/';

		z.mkdir(dest + dir, function(logStr) {
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
						(isDir ? ftpList : ftpGet.push)(path, callback);
					});
				});
			};
		});

	},
	ftpGet = async.queue(function(path, callback) {
		callback = callback || function() {};

		/*==========  Get Content of file 'path'  ==========*/
		z.logD('Parsing over ' + path.file);

		x.ftpC.getGetSocket(path, function(err, socket) {
			if (err) {
				z.logErr('There was an error while parsing over ' + path.file + ': ');
				z.log(err);
			}

			var writeStream = fs.createWriteStream(dest + path);
			writeStream.on('error', function() {
				z.logErr('There was an error while writing over ' + path.file + ': ');
			});

			socket.on('readable', function() {
				x.ftpC.emitProgress({
					filename: path,
					action: 'get',
					socket: x.ftpC
				});
			});
			socket.on('end', function() {
				z.logV('Created '.info + 'File: '.file + path.data);
				callback();
			});
			socket.pipe(options.aes).pipe(writeStream);
			socket.resume();
		});
	/*==========  Queuing only 1 at a time because currently I'm not creating individual instance of ftpC  ==========*/
	}, 1);
