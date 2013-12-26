var crypto = require('crypto'),
	dsi = require('./dsi'),
	myPrompt = require("prompt"),
	z = new dsi();

var krypto = module.exports = function() {
	var self = this;

	this.schema = {
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
					z.log('You want to ' + (finalVal ? 'encyrpt' : 'decrypt'));
					return finalVal;
				}
			},
			multiple: {
				description: 'Do you want to process multiple values -- in comma separated form',
				// type: 'boolean',
				pattern: /^[yn]$/,
				message: 'Please use default or enter y/n',
				default: 'n',
				before: function(val) { z.log('You want to process ' + val); return val === 'y'; }
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

	this.getInput();
}

krypto.prototype.getInput = function() {
	var self = this;
	myPrompt.start();
	myPrompt.get(this.schema, function (err, result) {
		if(result.multiple) {
			z.log('Processing multiple entries in the Array:');
			result.value.split(',').forEach(function(val) {
				self.kryption(val, result);
			})
		} else {
			z.log('Processing single entry:');
			self.kryption(result.value, result);
		}
		return err ? z.log('Error in Input') : result;
	});
}
krypto.prototype.kryption = function(value, options) {
	var self = this;
	z.logBul('Processing - ' + value);
	options.Krypted = (options.encrypt ? self.enKrypt : self.deKrypt)(value, options.password);
	z.logBul('Processed - ' + options.Krypted);
	z.logBul('Process Hint - ' + options.passwordHint);
	process.exit();
}
krypto.prototype.enKrypt = function(value, pass) {
	try {
		var enKryptAES = crypto.createCipher('aes-256-cbc', pass);
		var enKrypted = enKryptAES.update(value,'utf8','hex');
		enKrypted += enKryptAES.final('hex');
		return enKrypted;
	} catch (err) { z.log('Error in Encrypting'); }
}
krypto.prototype.deKrypt = function(value, pass) {
	try {
		var deKryptAES = crypto.createDecipher('aes-256-cbc', pass);
		var deKrypted = deKryptAES.update(value,'hex','utf8');
		deKrypted += deKryptAES.final('utf8');
		return deKrypted;
	} catch (err) { z.log('Error in Decrypting'); }
}