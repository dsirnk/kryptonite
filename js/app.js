var pkg = require("./package.json"),
	dsi = require("./lib/dsi"),
	my = require("../config.json"),
	krypto = require("./lib/krypto"),
	fxp = require("./lib/fxp"),
	async = require("async"),
	// firebase = require('firebase'),
	// firebaseRoot = new firebase(pkg.firebase + '/krypt'),
	dest = '',
	z = new dsi();

// krypt = new krypto();
// var fireBase = function(options) {
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
			fx.ftpC.list(dir, function(err, list) {
				if (err) throw err;
				async.forEach(list, function(file, callback) {
					if(['.', '..'].indexOf(file.name) === -1) {
						var path = dir + file.name;
						var destPath = dest + path;
						process.stdout.write(Array(dir.split('/').length).join('\t'));
						z.ls(file);
						if(file.type === 'd') {
							ftpList(path + '/');
							z.mkdir(destPath);
						} else {
							fx.ftpC.get(path, function(err, stream) {
								if (err) throw err;
								// stream.once('close', function() { fx.ftpC.end(); });
								stream.pipe(z.mkfile(destPath));
							});
						}
					}
				}, function(err) {
						z.log('iterating done');
				});
			});
		};
		ftpList('.data/');
		fx.ftpC.end();
	}
})