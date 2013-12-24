var ftp = require('ftp');
var fs = require('fs');
var util = require('util');
var config = require('../config.json')
var myPrompt = require("prompt");
var schema = {
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
};

var c = new ftp();
c.on('ready', function() {
	c.list(function(err, list) {
		if (err) throw err;
		// console.dir(list);
		console.log(util.inspect(list, true, null, true));
		c.end();
	});
	// c.get('thisFile.txt', function(err, stream) {
	// 	if (err) throw err;
	// 	stream.once('close', function() { c.end(); });
	// 	stream.pipe(fs.createWriteStream('thisFile.txt'));
	// });
});

var getFTPConfig = function(schema) {
	myPrompt.start();
	myPrompt.get(schema, function (err, result) {
		c.connect(result);
	});
}

// connect to localhost:21 as anonymous
getFTPConfig(schema);
/**
 host - string - The hostname or IP address of the FTP server. Default: 'localhost'
 port - integer - The port of the FTP server. Default: 21
 secure - mixed - Set to true for both control and data connection encryption, 'control' for control connection encryption only, or 'implicit' for implicitly encrypted control connection (this mode is deprecated in modern times, but usually uses port 990) Default: false
 secureOptions - object - Additional options to be passed to tls.connect(). Default: (none)
 user - string - Username for authentication. Default: 'anonymous'
 password - string - Password for authentication. Default: 'anonymous@'
 connTimeout - integer - How long (in milliseconds) to wait for the control connection to be established. Default: 10000
 pasvTimeout - integer - How long (in milliseconds) to wait for a PASV data connection to be established. Default: 10000
 keepalive - integer - How often (in milliseconds) to send a 'dummy' (NOOP) command to keep the connection alive. Default: 10000
/**/