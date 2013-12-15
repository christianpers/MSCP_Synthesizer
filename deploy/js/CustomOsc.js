(function(){

	window.CustomOsc = function(){

		this._audioCtx = null;
		this._oscNode = null;
		this._gainNode = null;
		this._el = null;
		this._visualControllers = {freq: 
								{
									valEl: null,
									blockEl: null,
									slider: null
								},
								gain: {
									valEl: null,
									blockEl: null,
									slider: null
								}
							
							};

		this._freqSlider = null;
		this._gainSlider = null;

		this._gainVol = undefined;
	};

	var p = CustomOsc.prototype;

	p.setup = function(ctx, type, freq, vol, envObj, el, mul){

		this._el = el;

		this._mul = mul;
		
		this._visualControllers.freq.blockEl = this._el.querySelector('.inputBlock.freq');
		this._visualControllers.freq.valEl = this._visualControllers.freq.blockEl.querySelector('.val');
		this._visualControllers.freq.slider = this._visualControllers.freq.blockEl.querySelector('input');
		this._visualControllers.freq.slider.value = freq;
		this._visualControllers.freq.slider.addEventListener('change', this.onFreqSliderChange.bind(this));

		var attackSlider = this._el.querySelector('.inputBlock.envelope .attack input');
		attackSlider.addEventListener('change', this.onAttackSliderChange.bind(this));
	
	
		this._audioCtx = ctx;
		this._oscNode = this._audioCtx.createOscillator();
		// this._gainNode = this._audioCtx.createGainNode();
		this._envelope = new Envelope();
		this._envelope.setup(ctx, this._el.querySelector('.inputBlock.envelope'), envObj);

		// this.setGain(gain);
		this._gainVol = vol;
		this._oscNode.type = type;
		this.setFreq(freq);
		this._oscNode.connect(this._envelope.node);
		this._oscNode.start(0);

	};



	

	p.computeFreqMul = function(freq){

		return freq * this._mul / 4;	
	};

	p.setGain = function(gain){

		// this._gainNode.gain.value = gain;
		// this._visualControllers.gain.valEl.innerHTML = gain;
	};

	

	p.setFreq = function(freq){

		var mulFreq = this.computeFreqMul(freq);

		this._oscNode.frequency.value = mulFreq;
		this._visualControllers.freq.valEl.innerHTML = mulFreq;
	};

	p.getOscNode = function(){

		return this._oscNode;	
	};

	p.getGainNode = function(){

		return this._envelope.node;
	};

	p.onFreqSliderChange = function(e){

		var val = e.target.value;
		this.setFreq(val);
	};

	p.onAttackSliderChange = function(e){



	};

	// p.onGainSliderChange = function(e){

	// 	var val = e.target.value;
	// 	this.setGain(val);
	// };

})();