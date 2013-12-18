(function(){

	window.FrequencyModulator = function(){

		this._audioCtx = null;
		this._modulatorNode = null;
		this._carrierNode = null;
		this._destinationNode = null;

		this._modWaveformAnalyser = null;

		this._useLFO = false;

	};

	var p = FrequencyModulator.prototype;

	p.setup = function(ctx){

		this._audioCtx = ctx;
		
		var modEl = document.querySelector('.modulatorNode');
		if (!this._useLFO){
			
			this._modulatorNode = new CustomOsc();
			this._modulatorNode.setup(this._audioCtx, 2, 110, 0, {att: 200, dec: 300, sus: 20, rel: 400}, modEl, 1);
		}else{
			this._modulatorNode = new LFO();
			this._modulatorNode.setup(this._audioCtx, 0);
		}
	

		var carrEl = document.querySelector('.carrierNode');
		this._carrierNode = new CustomOsc();
		this._carrierNode.setup(this._audioCtx, 2, 440, 1, {att: 100, dec: 200, sus: 70, rel: 200}, carrEl, 4);
	
		if (!this._useLFO)
			this._modulatorNode.getGainNode().connect(this._carrierNode.getOscNode().frequency);
		else
			this._modulatorNode.connect(this._carrierNode.getOscNode().frequency);

		// this._modWaveformAnalyser = new WaveformAnalyser();
		// this._modWaveformAnalyser.setup(ctx, document.getElementById('modWaveformAnalyser'));
		// this._modWaveformAnalyser.connect(this._modulatorNode.getOscNode());

		// this._carrWaveformAnalyser = new WaveformAnalyser();
		// this._carrWaveformAnalyser.setup(ctx, document.getElementById('carrWaveformAnalyser'));
		// this._carrWaveformAnalyser.connect(this._carrierNode.getGainNode());

		this._carrWaveformAnalyser = new WaveformAnalyser();
		this._carrWaveformAnalyser.setup(ctx, document.getElementById('carrWaveformAnalyser'), 2048);
		this._carrWaveformAnalyser.connect(this._modulatorNode.getOscNode());

		this._carrSpectrumAnalyser = new SpectrumAnalyser();
		this._carrSpectrumAnalyser.setup(ctx, document.getElementById('carrSpectrumAnalyser'));
		this._carrSpectrumAnalyser.connect(this._carrierNode.getGainNode());

		this._carrierAmpVisual = carrEl.querySelector('.amp');
		this._modulatorAmpVisual = modEl.querySelector('.amp');
		this._updateVisualsTimer = null;

	};

	p.connect = function(node){

		this._carrierNode.getGainNode().connect(node);
	};

	p.noteOn = function(freq){

		if (!this._useLFO){
			this._modulatorNode.setFreq(freq);
			this._modulatorNode._envelope.trigger(this._audioCtx.currentTime, freq);
		}
		

		this._carrierNode.setFreq(freq);
		this._carrierNode._envelope.trigger(this._audioCtx.currentTime, this._carrierNode._gainVol);

		

		
	};

	p.noteOff = function(){

		// clearInterval(this._updateVisualsTimer);

		var currTime = this._audioCtx.currentTime;
		if (!this._useLFO)
			this._modulatorNode._envelope.release(currTime);
	
		this._carrierNode._envelope.release(currTime);

		// this._modulatorNode.stop(currTime);
		// this._carrierNode.stop(currTime);

	};

	p.updateVisuals = function(){

		
		this._carrierAmpVisual.innerHTML = this._carrierNode._envelope.node.gain.value;
		if (!this._useLFO)
			this._modulatorAmpVisual.innerHTML = this._modulatorNode._envelope.node.gain.value;

		this._carrWaveformAnalyser.update();
		this._carrWaveformAnalyser.render();

		this._carrSpectrumAnalyser.update();
		this._carrSpectrumAnalyser.render();


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