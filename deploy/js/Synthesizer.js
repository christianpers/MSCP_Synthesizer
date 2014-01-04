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

	p.setup = function(ctx, el, gain, connectFn){

		/*   
			FM -> LOPASS -> MasterGain ----> MeterNode
									   ----> RecorderNode
									   ----> WaveAnalyser
									   ----> MixerOut
		
		*/

		this._el = el;
		this._content = el.querySelector('.content');

		// this._audioCtx = ctx;
		// this._freqModulator = new FrequencyModulator();
		// this._freqModulator.setup(this._audioCtx);

		// this._keyboard = new Keyboard();
		// this._keyboard.setup();

		// this._currentOctave = Synthesizer.BASE_OCTAVE;

		// this._masterGainVisuals.slider = this._el.querySelector('.masterGainNode input');
		// this._masterGainVisuals.val = this._el.querySelector('.masterGainNode .val');
		// this._masterGain = this._audioCtx.createGain();
		// this._masterGainVisuals.slider.value = gain;
		// this.setMasterGain(gain);

		// this._masterGainVisuals.slider.addEventListener('change', this._onMasterGainSliderChange.bind(this));
		

	
		

		// this._meterNode = new MeteringNode();
		// this._meterNode.setup(this._audioCtx);

	
		// this._masterGain.connect(this._meterNode.node);

	
	
		// this._lopass = this._audioCtx.createBiquadFilter();
		// this._lopass.type = "lowpass";
		// this._lopass.frequency.value = 2600;

		// this._freqModulator.connect(this._lopass);

	
		// this._recorderNode = new RecordNode();
		// var parent = document.getElementById('mainContainer');
		// var recordTriggerEl = parent.querySelector('.recordCircle');
		// this._recorderNode.setup(this._audioCtx, recordTriggerEl);
	
		// this._lopass.connect(this._recorderNode.node);
		// this._recorderNode.node.connect(this._masterGain);
	
		// this._lopass.connect(this._masterGain);

		// this._masterWaveformAnalyser = new WaveformAnalyser();
		// this._masterWaveformAnalyser.setup(this._audioCtx, document.getElementById('masterWaveformAnalyser'),256);
		// this._masterWaveformAnalyser.connect(this._masterGain);

		// document.addEventListener('keydown', this._onKeyDown.bind(this));
		// document.addEventListener('keyup', this._onKeyUp.bind(this));

		


	};

	p.show = function(){

		this._content.style.height = '1000px';

	};

	p.hide = function(){

		this._content.style.height = '0px';
	};

	p.getOutputNode = function(){

		return	this._masterGain;	
	};



	p.setMasterGain = function(val){

		this._masterGain.gain.value = val;
		this._masterGainVisuals.val.innerHTML = val;

	};

	p._onMasterGainSliderChange = function(e){

		var val = e.target.value;
		this.setMasterGain(val);
	};

	p.getLatestRecordBuffer = function(){

		return this._recorderNode.getLatestBuffer();
	};

	p.deactivateRecording = function(){

		this._recorderNode.deactivateRecording();	
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