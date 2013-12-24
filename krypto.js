/* config variables
-------------------*/

var pkg = require("./package.json");

var firebase = require('firebase');
var fbRoot = new firebase(pkg.firebase + '/krypt');

var krypto = require('crypto');

var enKrypt = function(text, pass) {
	var enKryptAES = krypto.createCipher('aes-256-cbc',pass);
	var enKrypted = enKryptAES.update(text,'utf8','hex');
	enKrypted += enKryptAES.final('hex');
	return enKrypted;
}
var deKrypt = function(text, pass) {
	var deKryptAES = krypto.createDecipher('aes-256-cbc',pass);
	var deKrypted = deKryptAES.update(text,'hex','utf8');
	deKrypted += deKryptAES.final('utf8');
	return deKrypted;
}
var processKrypt = function(data, options) {
	console.log('-> Processing - ' + data);
	options.Krypted = (options.encrypt ? enKrypt : deKrypt)(data, options.password);
	console.log('-> Processed - ' + options.Krypted);
	console.log('-> Process Hint - ' + options.passwordHint);
}
var fireKrypt = function(options) {
	console.log('-> Firing data - ' + options.Krypted + ', hint: ' + options.passwordHint);
	fbRoot.push({aes: (options.encrypt ? enKrypt : deKrypt)(data, options.password),
		passwordHint: options.passwordHint});
}

/* prompt package
-----------------*/
var prompt = require("prompt");

var schema = {
	properties: {
		encrypt: {
			description: 'Do you want to enKrypt',
			// type: 'boolean',
			pattern: /^[yn]$/,
			message: 'Please use default or enter y/n',
			default: 'y',
			before: function(val) { console.log('You said ' + val); return val === 'y'; }
		},
		multiple: {
			description: 'Are you passing in a Array',
			// type: 'boolean',
			pattern: /^[yn]$/,
			message: 'Please use default or enter y/n',
			default: 'n',
			before: function(val) { console.log('You said ' + val); return val === 'y'; }
		},
		data: {
			description: 'Please enter the data to be processed',
			required: true
		},
		password: {
			description: 'Your seceret passphrase',
			hidden: true
		},
		passwordHint: {
			description: 'You may need a hint in future'
		}
	}
};
prompt.start();
prompt.get(schema, function (err, result) {
	console.log(err);
	if(result.multiple) {
		console.log('Processing multiple entries in the Array:');
		result.data.split(',').forEach(function(data) {
			processKrypt(data, result);
		})
	} else {
		console.log('Processing single entry:');
		processKrypt(result.data, result);
	}
	console.log('%j', result);
	// fireKrypt(result);
	process.exit();
});



/* including
------------*

var fs = require("fs");
// file system for fs.watch OR fs.watchFile OR fs.unwatch OR fs.read
// http://nodejs.org/api/fs.html#fs_file_system



/* get Input
------------*

var sys = require("sys");

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
	// note:  d is an object, and when converted to a string it will
	// end with a linefeed.  so we (rather crudely) account for that
	// with toString() and then substring()
	console.log("you entered: [" + d.toString().substring(0, d.length-1) + "]");
});



/* readline, nodes API
----------------------*

var readline = require('readline'),
rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('OHAI> ');
rl.prompt();

rl.on('line', function(line) {
  switch(line.trim()) {
	case 'hello':
	  console.log('world!');
	  break;
	default:
	  console.log('Say what? I might have heard `' + line.trim() + '`');
	  break;
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});

/**/
