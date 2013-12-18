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

		this._masterWaveformAnalyser = null;

		this._recorderNode = null;
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
		

	
		this._freqModulator.connect(this._masterGain);

		this._meterNode = new MeteringNode();
		this._meterNode.setup(this._audioCtx);

	
		this._masterGain.connect(this._meterNode.node);

		this._meterNode.connect(this._audioCtx.destination);

		// var delayNodeTest = this._audioCtx.createDelayNode();
		// delayNodeTest.delayTime.value = .4;
		

		var lopassTest = this._audioCtx.createBiquadFilter();
		lopassTest.type = "lowpass";
		lopassTest.frequency.value = 800;

		this._masterGain.connect(lopassTest);

		this._recorderNode = new RecordNode();
		this._recorderNode.setup(this._audioCtx);
		lopassTest.connect(this._recorderNode.node);
		this._recorderNode.createNewBuffer();
		this._recorderNode.node.connect(this._audioCtx.destination);

		

		lopassTest.connect(this._audioCtx.destination);

		this._masterWaveformAnalyser = new WaveformAnalyser();
		this._masterWaveformAnalyser.setup(this._audioCtx, document.getElementById('masterWaveformAnalyser'),256);
		this._masterWaveformAnalyser.connect(this._masterGain);

		document.addEventListener('keydown', this._onKeyDown.bind(this));
		document.addEventListener('keyup', this._onKeyUp.bind(this));

		var self = this;
		this._updateVisualsTimer = setInterval(function(){

			self.updateVisuals();


		},60);


	};

	// function processAudio(e) {
	//   var buffer = e.inputBuffer.getChannelData(0);

	//   var isClipping = false;
	//   // Iterate through buffer to check if any of the |values| exceeds 1.
	//   for (var i = 0; i < buffer.length; i++) {
	//     var absValue = Math.abs(buffer[i]);
	//     if (absValue >= 1) {
	//       isClipping = true;
	//       break;
	//     }
	//   }
	// }

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
			var type = keyObj.type;
			if (keyObj.triggered) return;
			
			if (type == 'note'){
				keyObj.triggered = true;
				var freq = this.getFreq(keyObj.step);
				this._freqModulator.noteOn(freq);

			}else if (type == 'octave'){
				this.setNewOctave(keyObj.direction);
			}
			
			
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
		};

	};

	p.setNewOctave = function(direction){

		console.log(direction);

		if (direction == 'up'){
			if (this._currentOctave == 8) return;
			this._currentOctave++;
		}else if (direction == 'down'){
			if (this._currentOctave == 0) return;
			this._currentOctave--;
		}
	};
	

	p.getFreq = function(step){

		var tempOctave = this._currentOctave - Synthesizer.BASE_OCTAVE;
		var tempSteps = 12 * tempOctave + step;
		
		var freq = Synthesizer.BASE_FREQ * Math.pow(Synthesizer.ROOT, tempSteps);

		return freq;
	};

	p.updateVisuals = function(){

		this._masterWaveformAnalyser.update();
		this._masterWaveformAnalyser.render();

		this._freqModulator.updateVisuals();

	};




})();