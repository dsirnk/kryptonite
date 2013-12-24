/* config variables
-------------------*/

var pkg = require("./package.json"),
	firebase = require('firebase'),
	firebaseRoot = new firebase(pkg.firebase + '/krypt'),
	krypto = require('crypto'),
	myPrompt = require("prompt"),
	schema = {
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
		if(result.multiple) {
			console.log('Processing multiple entries in the Array:');
			result.value.split(',').forEach(function(val) {
				kryption(val, result);
			})
		} else {
			console.log('Processing single entry:');
			kryption(result.value, result);
		}
		console.log(err || result);
		process.exit();
	});
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

