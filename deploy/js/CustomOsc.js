(function(){

	window.CustomOsc = function(){

		this._audioCtx = null;
		this._oscNode = null;
		this._gainNode = null;
	};

	var p = Modulator.prototype;

	p.setup = function(ctx, type, freq, gain){

		this._audioCtx = ctx;
		this._oscNode = this._audioCtx.createOscillator();
		this._gainNode = this._audioCtx.createGainNode();
		this.setGain(gain);
		this._oscNode.type = type;
		this.setFreq(freq);
		this._oscNode.connect(this._gainNode);
		this.start();
		
	};

	p.start = function(){

		this._oscNode.start(0);	
	};

	p.setGain = function(gain){

		this._gainNode.gain.value = gain;	
	};

	p.setFreq = function(freq){

		this._oscNode.frequency.value = freq;
	};




})();