(function(){

	window.Mixer = function(){

		this._audioCtx = null;
		this._synthesizer = null;
		this._sequencer = null;
		this._el = null;
		this._micRecordNode = null;

		this._playbackItems = [];

	};

	var p = Mixer.prototype;

	p.setup = function(el){

		this._audioCtx = new webkitAudioContext();

		this._el = el;


		this._synthesizer = new Synthesizer();
		this._synthesizer.setup(this._audioCtx, this._el.querySelector('.synthesizer'), 1);
		// this.connectToMaster(this._synthesizer.getOutputNode())

		this._sequencer = new Sequencer();
		this._sequencer.setup(this._audioCtx, this._el.querySelector('.sequencer'));
		// this.connectToMaster(this._sequencer.getOutputNode());
	
		// var playbtn = document.documentElement.querySelector('.playBtn');
		// playbtn.addEventListener('click', this._onPlayClick.bind(this));

		var micPlayBtn = document.documentElement.querySelector('.addToSequencer');
		micPlayBtn.addEventListener('click', this._onMicPlayClick.bind(this));

		this._micRecordNode = new MicInNode();
		this._micRecordNode.setup(this._audioCtx, this._el.querySelector('.mic'));

		this.connectToMaster(this._micRecordNode.getOutNode());
	
		this._sequencer.play();

		requestAnimFrame(this.updateVisuals.bind(this));
	};



	p.showMicRecord = function(){

		this._micRecordNode.show();	
	};
	p.hideMicRecord = function(){

		this._micRecordNode.hide();	
	};
	p.showSequencer = function(){

		this._sequencer.show();	
	};
	p.hideSequencer = function(){

		this._sequencer.hide();	
	};
	p.showSynthesizer = function(){

		this._synthesizer.show();	
	};
	p.hideSynthesizer = function(){

		this._synthesizer.hide();	
	};



	p._onMicPlayClick = function(e){

		var playbackItem = new PlaybackItem();
		playbackItem.setup(this._audioCtx, this._micRecordNode.getLatestRecordBuffer(), this._el.querySelector('.sequencer .content'));
		this._sequencer.addToBeatLibrary(playbackItem);
		this.connectToMaster(playbackItem.getOutNode());	
	};

	p._onPlayClick = function(e){

		// this._sequencer.play();

		// this._synthesizer.deactivateRecording();

		var playbackItem = new PlaybackItem();
		playbackItem.setup(this._audioCtx, this._synthesizer.getLatestRecordBuffer());
		this._sequencer.addToBeatLibrary(playbackItem);
		this.connectToMaster(playbackItem.getOutNode());

		// this._playbackItems.push(playbackItem);
	};


	p.connectToMaster = function(node){

		node.connect(this._audioCtx.destination);
	};


	p.updateVisuals = function(){

		// this._synthesizer.updateVisuals();
		this._sequencer.updateVisuals();
		this._micRecordNode.updateVisuals();

		requestAnimFrame(this.updateVisuals.bind(this));
			
	};

})();