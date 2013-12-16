(function(){

	window.FrequencyModulator = function(){

		this._audioCtx = null;
		this._modulatorNode = null;
		this._carrierNode = null;
		this._destinationNode = null;

	};

	var p = FrequencyModulator.prototype;

	p.setup = function(ctx){

		this._audioCtx = ctx;
		
		var modEl = document.querySelector('.modulatorNode');
		this._modulatorNode = new CustomOsc();
		this._modulatorNode.setup(this._audioCtx, "sine", 110, .5, {att: 50, dec: 600, sus: 20, rel: 400}, modEl, 1);

		var carrEl = document.querySelector('.carrierNode');
		this._carrierNode = new CustomOsc();
		this._carrierNode.setup(this._audioCtx, "sine", 440, 1, {att: 10, dec: 200, sus: 70, rel: 200}, carrEl, 4);
	
		this._modulatorNode.getGainNode().connect(this._carrierNode.getOscNode().frequency);

		this._carrierAmpVisual = carrEl.querySelector('.amp');
		this._modulatorAmpVisual = modEl.querySelector('.amp');
		this._updateVisualsTimer = null;
		
	};

	p.connect = function(node){

		this._carrierNode.getGainNode().connect(node);
	};

	p.noteOn = function(freq){

		this._modulatorNode.setFreq(freq);
		console.log(this.getModAmplitude(this._modulatorNode._oscNode.frequency.value));
		this._modulatorNode._envelope.trigger(this._audioCtx.currentTime, this.getModAmplitude(this._modulatorNode._oscNode.frequency.value));

		this._carrierNode.setFreq(freq);
		this._carrierNode._envelope.trigger(this._audioCtx.currentTime, this._carrierNode._gainVol);

		var self = this;
		this._updateVisualsTimer = setInterval(function(){

			self.updateVisuals();

		},60);

		
	};

	p.noteOff = function(){

		clearInterval(this._updateVisualsTimer);

		var currTime = this._audioCtx.currentTime;

		this._modulatorNode._envelope.release(currTime);
		this._carrierNode._envelope.release(currTime);

		// this._modulatorNode.stop(currTime);
		// this._carrierNode.stop(currTime);

	};

	p.updateVisuals = function(){

		
		this._carrierAmpVisual.innerHTML = this._carrierNode._envelope.node.gain.value;
		this._modulatorAmpVisual.innerHTML = this._modulatorNode._envelope.node.gain.value;

	};

	p.getModAmplitude = function (freq){

  		return freq;	
  	};

	p.setCarrierGain = function(val){

		this._carrierNode.setGain(val);
	};

	p.setCarrierFreq = function(val) {

		this._carrierNode.setFreq(val);	
	};

	p.setModulatorGain = function(val){

		this._modulatorNode.setGain(val);	
	};

	p.setModulatorFreq = function(val){

		this._modulatorNode.setFreq(val);	
	};





})();