(function(){

	window.RecordNode = function(){

		this._audioCtx = null;
		this._el = null;
		this.node = null;
		this._buffers = [];

		this.record = false;
	
	};

	var p = RecordNode.prototype;

	p.setup = function(ctx){

		this._audioCtx = ctx;
		this.node = ctx.createJavaScriptNode(2048,2,2);
		var parent = document.getElementById('mainContainer');
		this._el = parent.querySelector('.recordCircle');

		this._el.addEventListener('click', this.onRecordClick.bind(this)); 

		var self = this;
		this.node.onaudioprocess = function(e){
			self.audioProcess.call(self, e);
		}

	};

	p.onRecordClick = function(){

		if (this.record) this.record = false;
		else this.record = true;

		console.log(this.record);
	};

	p.audioProcess = function(e){

		if (!this.record) return;

		var buffer = this._buffers[0];

		buffer.lBuffer.push(e.inputBuffer.getChannelData(0));
		buffer.rBuffer.push(e.inputBuffer.getChannelData(1));

	};

	p.activateRecording = function(){

		this.record = true;	
	};

	p.deactivateRecording = function(){

		this.record = false;

	};

	p.createNewBuffer = function(){

		var buffer = new RecordBufferItem();
		buffer.init();
		this._buffers.push(buffer);
			
	};


})();