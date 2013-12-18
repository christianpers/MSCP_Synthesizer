(function(){

	window.LFO = function(){

		this._audioCtx = null;
		this._el = null;
		this.node = null;
	
	};

	var p = LFO.prototype;

	p.setup = function(ctx, waveType){

		this._audioCtx = ctx;
		this.node = ctx.createOscillator();
		this.node.type = waveType;
		this.node.frequency.value = 2;

		this.gainNode = ctx.createGain();
		this.gainNode.gain.value = 300;

		this.node.connect(this.gainNode);

		this.node.start(0);

	};

	p.getNode = function(){

		return this.gainNode;
	};

	p.getOscNode = function(){

		return this.node;	
	};

	p.connect = function(nodeIn){

		this.gainNode.connect(nodeIn);
	};
	

})();