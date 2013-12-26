var pkg = require("./package.json"),
	dsi = require("./lib/dsi"),
	// krypto = require("./lib/krypto"),
	// krypt = new krypto(),
	fxp = require("./lib/fxp"),
	fx = new fxp(),
	// firebase = require('firebase'),
	// firebaseRoot = new firebase(pkg.firebase + '/krypt'),
	z = new dsi();

// var fireBase = function(options) {
// 	console.log('-> Firing value - ' + options.Krypted + ', hint: ' + options.passwordHint);
// 	firebaseRoot.push({aes: (options.encrypt ? krypto.enKrypt : krypto.deKrypt)(options.value, options.password),
// 		passwordHint: options.passwordHint});
// }

fx.ftpReady = function(ftpC) {
	var ftpList = function(dir) {
		ftpC.list(dir, function(err, list) {
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
	ftpC.end();
	// ftpC.get('thisFile.txt', function(err, stream) {
	// 	if (err) throw err;
	// 	stream.once('close', function() { ftpC.end(); });
	// 	stream.pipe(fs.createWriteStream('thisFile.txt'));
	// });
}