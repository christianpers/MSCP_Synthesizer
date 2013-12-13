(function(){

	window.Synthesizer = function(){

		this._audioCtx = null;
		this._modulatorNode = null;
		this._carrierNode = null;
	};

	var p = Synthesizer.prototype;

	p.setup = function(){

		this._audioCtx = new webkitAudioContext();
		this._modulatorNode = new CustomOsc();
		this._modulatorNode.setup(this._audioCtx, "sine", 500, .3);
		this._carrierNode = new CustomOsc();
		this._carrierNode.setup(this._audioCtx, "sine", 400, 1)

	};




})();