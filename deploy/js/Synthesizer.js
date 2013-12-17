(function(){

	window.Synthesizer = function(){

		this._el = null;

		this._audioCtx = null;
		this._freqModulator = null;
		this._keyboard = null;
		this._currentOctave = undefined;

		this._masterGain = null;

		this._masterGainVisuals = {};
		this._masterGainVisuals.slider = null;
		this._masterGainVisuals.val = 0;
	};

	var p = Synthesizer.prototype;

	Synthesizer.ROOT = Math.pow(2,(1/12));
	Synthesizer.BASE_FREQ = 440;
	Synthesizer.BASE_OCTAVE = 4;

	p.setup = function(el, gain){

		this._el = el;

		this._audioCtx = new webkitAudioContext();
		this._freqModulator = new FrequencyModulator();
		this._freqModulator.setup(this._audioCtx);

		this._keyboard = new Keyboard();
		this._keyboard.setup();

		this._currentOctave = Synthesizer.BASE_OCTAVE;

		this._masterGainVisuals.slider = this._el.querySelector('.masterGainNode input');
		this._masterGainVisuals.val = this._el.querySelector('.masterGainNode .val');
		this._masterGain = this._audioCtx.createGain();
		this._masterGainVisuals.slider.value = gain;
		this.setMasterGain(gain);

		this._masterGainVisuals.slider.addEventListener('change', this._onMasterGainSliderChange.bind(this));
		

		this.meterNode = this._audioCtx.createJavaScriptNode(2048, 1, 1);
		this.meterNode.onaudioprocess = processAudio;
	
		this._freqModulator.connect(this._masterGain);
		this._masterGain.connect(this.meterNode);
		


		this.meterNode.connect(this._audioCtx.destination);

		document.addEventListener('keydown', this._onKeyDown.bind(this));
		document.addEventListener('keyup', this._onKeyUp.bind(this));


	};

	function processAudio(e) {
	  var buffer = e.inputBuffer.getChannelData(0);

	  var isClipping = false;
	  // Iterate through buffer to check if any of the |values| exceeds 1.
	  for (var i = 0; i < buffer.length; i++) {
	    var absValue = Math.abs(buffer[i]);
	    if (absValue >= 1) {
	      isClipping = true;
	      break;
	    }
	  }
	}

	p.setMasterGain = function(val){

		this._masterGain.gain.value = val;
		this._masterGainVisuals.val.innerHTML = val;

	};

	p._onMasterGainSliderChange = function(e){

		var val = e.target.value;
		this.setMasterGain(val);
	};

	p._onKeyDown = function(e){

		var keyCode = e.keyCode;
		var keyObj = this._keyboard.getKey(keyCode);
		if (keyObj !== null){
			e.preventDefault();
			if (keyObj.triggered) return;
			keyObj.triggered = true;
			var freq = this.getFreq(keyObj.step);
			this._freqModulator.noteOn(freq);
			
		}
	};

	p._onKeyUp = function(e){

		e.preventDefault();

		var keyCode = e.keyCode;
		var keyObj = this._keyboard.getKey(keyCode);
		if (keyObj !== null){
			if (!keyObj.triggered) return;
		
			keyObj.triggered = false;
			this._freqModulator.noteOff();
		}

	};
	

	p.getFreq = function(step){

		var tempOctave = this._currentOctave - Synthesizer.BASE_OCTAVE;
		var tempSteps = 12 * tempOctave + step;
		
		var freq = Synthesizer.BASE_FREQ * Math.pow(Synthesizer.ROOT, tempSteps);

		return freq;v
	};



})();