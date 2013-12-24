var fs = require('fs'),
	myPrompt = require("prompt"),
	dsi = new require('./dsi'),
	config = require('../config.json'),
	ftpConfig = {},
	schema = {
		properties: {
			host: {
				description: 'The hostname or IP address of the FTP server.',
				// pattern: /^(ftp(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/,
				message: 'Please enter a valid host address',
				default: config.websites.themobilestore.host
			},
			user: {
				description: 'Username for authentication.',
				message: 'Please enter a valid user/username',
				default: config.websites.themobilestore.user
			},
			password: {
				description: 'Password for authentication.',
				hidden: true
			}
		}
	},
    z = new dsi();

var getFTPConfig = function(schema, callback) {
	myPrompt.start();
	myPrompt.get(schema, function (err, result) {
		err || callback(result);
	});
}

getFTPConfig(schema, function(ftpConfig) {

	/*-- node-ftp --*/

	var ftp = require('ftp');
	var ftpC = new ftp();
	ftpC.connect(ftpConfig);
	// ftpC.on('connect', function() { z.log('Connection :: connect'); });
	ftpC.on('ready', function() {
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
							ftpList(dir + file.name + '/');
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
	});
	ftpC.on('error', function(err) { z.log('Connection :: error :: ' + err); });
	// ftpC.on('end', function() { z.log('Connection :: end'); });
	// ftpC.on('close', function(had_error) { z.log('Connection :: close'); });
});