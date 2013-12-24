/* config variables
-------------------*/

var pkg = require("./package.json");

var firebase = require('firebase');
var firebaseRoot = new firebase(pkg.firebase + '/krypt');

var krypto = require('crypto');
var util = require('util');

var myPrompt = require("prompt");
var schema = {
	properties: {
		encrypt: {
			description: 'Do you want to encrypt or decrypt',
			// type: 'boolean',
			pattern: /^e|encrypt|d|decrypt$/,
			message: 'Accepted values:\n'+
					'\t\tencrypt: e OR encrypt\n'+
					'\t\tdecrypt: d OR decrypt',
			default: 'encrypt',
			before: function(val) {
				var finalVal = (['d','decrypt'].indexOf(val) == -1);
				console.log('You want to ' + (finalVal ? 'encyrpt' : 'decrypt'));
				return finalVal;
			}
		},
		multiple: {
			description: 'Do you want to process multiple values -- in comma separated form',
			// type: 'boolean',
			pattern: /^[yn]$/,
			message: 'Please use default or enter y/n',
			default: 'n',
			before: function(val) { console.log('You want to process ' + val); return val === 'y'; }
		},
		value: {
			description: 'Please enter the value to be processed',
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
var getInput = function(schema) {
	myPrompt.start();
	myPrompt.get(schema, function (err, result) {
		getData(result);
		console.log(err || (util.inspect(result, true, null, true)));
		process.exit();
	});
}
var getData = function(data) {
	if(data.multiple) {
		console.log('Processing multiple entries in the Array:');
		data.value.split(',').forEach(function(val) {
			kryption(val, data);
		})
	} else {
		console.log('Processing single entry:');
		kryption(data.value, data);
	}
}
var kryption = function(value, options) {
	console.log('-> Processing - ' + value);
	options.Krypted = (options.encrypt ? enKrypt : deKrypt)(value, options.password);
	console.log('-> Processed - ' + options.Krypted);
	console.log('-> Process Hint - ' + options.passwordHint);
}
var fireBase = function(options) {
	console.log('-> Firing value - ' + options.Krypted + ', hint: ' + options.passwordHint);
	firebaseRoot.push({aes: (options.encrypt ? enKrypt : deKrypt)(options.value, options.password),
		passwordHint: options.passwordHint});
}
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
getInput(schema);

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
