(function(){

	window.RecordBufferItem = function(){

		this._audioCtx = null;
		
		this.id = undefined;
		this.recLength = 0;

	};

	var p = RecordBufferItem.prototype;

	
	p.init = function(){

		this.recLength = 0;

	
		this.lBuffer = [];
		this.rBuffer = [];

		this.id = new Date().getTime();

	
	};

	

	p.record = function(inBuffer){

		// var  = inBuffer[0].subarray(0);

		this.lBuffer.push(inBuffer[0].subarray(0));
		this.rBuffer.push(inBuffer[1].subarray(0));
		this.recLength += inBuffer[0].length;

		// console.log('update reclength: ', this.recLength);
	};

	

	p.getBuffer = function(){
		var buffers = [];
		// console.log('------- before -----------');
		// console.log(this.lBuffer[0]);
	
		buffers.push( this._mergeBuffers(this.lBuffer, this.recLength) );
		buffers.push( this._mergeBuffers(this.rBuffer, this.recLength) );

		// console.log('------- after ------------');
		// console.log(this.lBuffer);
		return buffers;
	};

	p._mergeBuffers = function(buffers, length){

		// console.log('length !!!',length);

		var result = new Float32Array(length);
		var offset = 0;
		for (var i=0; i < buffers.length; i++){
			result.set(buffers[i], offset);
			offset += buffers[i].length;
		}

		// console.log(result);

		return result;
	};




})();