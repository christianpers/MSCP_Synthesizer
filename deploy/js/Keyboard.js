(function(){

	window.Keyboard = function(){

		this._el = null;

		this._keys = [];
	};

	var p = Keyboard.prototype;

	Keyboard.KEY_INTS = [65,83,68,70,71,72,73,79];
	Keyboard.OCTAVE_INTS = [73,79];

	p.setup = function(){

		for (var i=0;i<Keyboard.KEY_INTS.length;i++){
			var key = Keyboard.KEY_INTS[i];
			var keyType = (Keyboard.OCTAVE_INTS.indexOf(key) == -1) ? 'note' : 'octave';
			var obj = {keyNr: key, triggered: false, step:i, type: keyType};
			if (keyType == 'octave')
				obj['direction'] = (key == 73) ? 'down' : 'up';
			
			
			
			this._keys.push(obj);
		}

	};

	p.getKey = function(key){


		var ret = null;
		for (var i=0; i<this._keys.length;i++){
			if (this._keys[i].keyNr == key){
				ret = this._keys[i];
				continue;
			}
		}



		return ret;

		
		
			
	};

})();