var pkg = require("./package.json"),
	dsi = require("./lib/dsi"),
	my = require("../config.json"),
	// krypto = require("./lib/krypto"),
	// krypt = new krypto(),
	fxp = require("./lib/fxp"),
	// firebase = require('firebase'),
	// firebaseRoot = new firebase(pkg.firebase + '/krypt'),
	z = new dsi();

// var fireBase = function(options) {
// 	console.log('-> Firing value - ' + options.Krypted + ', hint: ' + options.passwordHint);
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
				// z.dir(list);
				z.logDash();
				list.forEach(function(file) {
					if(['.', '..'].indexOf(file.name) === -1) {
						if(file.type === 'd') {
							z.log(dir + file.name.blue);
							/*-- recursive --*/
							// ftpList(dir + file.name + '/');
							/*-- --*/
						} else {
							z.log(dir + file.name);
						}
					}
				});
				z.logDash();
			});
		}
		ftpList('.data/');
		fx.ftpC.end();
		// fx.ftpC.get('thisFile.txt', function(err, stream) {
		// 	if (err) throw err;
		// 	stream.once('close', function() { fx.ftpC.end(); });
		// 	stream.pipe(fs.createWriteStream('thisFile.txt'));
		// });
	}

})