(function(){

	window.MeteringNode = function(){

		this._audioCtx = null;
		this._el = null;
		this.node = null;
	
	};

	var p = MeteringNode.prototype;

	p.setup = function(ctx){

		this._audioCtx = ctx;
		this.node = ctx.createJavaScriptNode(2048,2,2);

		var self = this;
		this.node.onaudioprocess = function(e){
			self.audioProcess.call(self, e);
		}
	
	};

	p.audioProcess = function(e){

		var leftBuffer = e.inputBuffer.getChannelData(0);
		this._checkClipping(leftBuffer);
	};

	p._checkClipping = function(buffer){

		var isClipping = false;
		for (var i=0; i<buffer.length;i++){

			var absVal = Math.abs(buffer[i]);
			// if (absVal > .6) console.log(absVal);
			if (absVal >= 1) {
				isClipping = true;
				console.log('clipping !!');
				break;
			}
		}
	};

	p.getNode = function(){

		return this.gainNode;
	};

	p.connect = function(nodeIn){

		this.node.connect(nodeIn);
	};
	

})();