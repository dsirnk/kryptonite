var _moduleName = 'krypto',
	_defaults = {
		prompt: {
			encrypt: {
				description: 'Do you want to [e]ncrypt or [d]ecrypt',
				// type: 'boolean',
				pattern: /^e|encrypt|d|decrypt$/,
				message: 'Accepted values:\n'+
						'\t\tencrypt: e OR encrypt\n'+
						'\t\tdecrypt: d OR decrypt',
				default: 'e',
				before: function(val) {
					var finalVal = (['d','decrypt'].indexOf(val) == -1);
					z.logV('Let\'s ' + (finalVal ? 'encyrpt' : 'decrypt') + ' then...');
					return finalVal;
				}
			},
			multiple: {
				description: 'Do you want to process multiple values -- in comma separated form',
				// type: 'boolean',
				pattern: /^[yn]$/,
				message: 'Please use default or enter y/n',
				default: 'n',
				before: function(val) {
					var finalVal = val === 'y';
					z.logV('Alright! ' + (!finalVal ? 'a single value' : 'multiple values'));
					return finalVal;
				}
			},
			value: {
				description: 'Please enter the value(s) to be processed',
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
	},
	crypto = require('crypto'),
	dsi = require('./dsi'),
	z = new dsi();

var krypto = module.exports = function(options) {
	this._name = _moduleName;
	this._defaults = _defaults;
	this.options = z.extend(_defaults, options);

	this.init();
}

krypto.prototype = {
	init: function() {
		z.logD('Initialized Module: ' + this._name.u);
		this.getInput();
	},
	getInput: function() {
		var self = this;

		z.prompt(this.options.prompt, function (result) {
			if(result.multiple) {
				z.logD('Processing multiple entries');
				result.value.split(',').forEach(function(val) {
					z.logO(self.kryption(val, result));
				})
			} else {
				z.logD('Processing single entry');
				z.logO(self.kryption(result.value, result));
			}
			return result;
		});
	},
	kryption: function(value, options) {
		var self = this;

		options.Krypted = (options.encrypt ? self.enKrypt : self.deKrypt)(value, options.password);
		return options.Krypted;
	},
	enKrypt: function(value, pass) {
		try {
			var enKryptAES = crypto.createCipher('aes-256-cbc', pass),
				enKrypted = enKryptAES.update(value,'utf8','hex');

			enKrypted += enKryptAES.final('hex');
			return enKrypted;
		} catch (err) { z.logErr(err, 'While Encrypting'); }
	},
	deKrypt: function(value, pass) {
		try {
			var deKryptAES = crypto.createDecipher('aes-256-cbc', pass),
				deKrypted = deKryptAES.update(value,'hex','utf8');

			deKrypted += deKryptAES.final('utf8');
			return deKrypted;
		} catch (err) { z.logErr(err, 'While Decrypting'); }
	}
}