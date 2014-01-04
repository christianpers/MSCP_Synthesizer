(function(){

	window.MicInNode = function(){

		this._audioCtx = null;
		this._micStreamNode = null;
		this._preGainNode = null;
		this._postGainNode = null;

		this._recorderNode = null;

		this._el = null;
		this._content = null;
	};

	var p = MicInNode.prototype;

	p.setup = function(ctx, el){

		this._audioCtx = ctx;

		this._preGainNode = ctx.createGain();
		this._postGainNode = ctx.createGain();

		this._el = el;
		this._content = el.querySelector('.content');

		this._recorderNode = new RecordNode();
		// var parent = document.getElementById('mainContainer');
		var recordTriggerEl = this._el.querySelector('.micRecBtn');
		this._recorderNode.setup(this._audioCtx, recordTriggerEl);

		this._preGainNode.connect(this._recorderNode.node);
		this._recorderNode.node.connect(this._postGainNode);

		this._waveformVisual = new WaveformAnalyser();
		this._waveformVisual.setup(this._audioCtx, this._content.querySelector('.waveformVisual'), 256);
		this._waveformVisual.connect(this._preGainNode);

		// this._masterWaveformAnalyser = new WaveformAnalyser();
		// this._masterWaveformAnalyser.setup(this._audioCtx, document.getElementById('masterWaveformAnalyser'),256);
		// this._masterWaveformAnalyser.connect(this._masterGain);

		this.requestMicAccess();
	
	};

	p.show = function(){


		this._content.style.height = '200px';

	};

	p.hide = function(){

		this._content.style.height = '0px';
	};

	p.requestMicAccess = function(){

		navigator.webkitGetUserMedia({audio:true}, this.gotStream.bind(this), function(e) {
           	
            console.log(e);
        });
	};

	p.gotStream = function(micIn){

		this._micStreamNode = this._audioCtx.createMediaStreamSource(micIn);
		this._micStreamNode.connect(this._preGainNode);


	};

	p.getOutNode = function(){

		return this._postGainNode;	
	};

	p.getLatestRecordBuffer = function(){

		return this._recorderNode.getLatestBuffer();
	};


	p.updateVisuals = function(){

		this._waveformVisual.update();
		this._waveformVisual.render();

			
	};

})();