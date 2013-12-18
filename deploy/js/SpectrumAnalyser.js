(function(){

	window.SpectrumAnalyser = function(){

		this.node = null;
		this._parentEl = null;
		this._canvasObj = {};
		this._audioCtx = null;
		this._processArray = [];
	};

	var p = SpectrumAnalyser.prototype;

	p.setup = function(ctx, parent){

		this.node = ctx.createAnalyser();
		this.node.fftSize = 128;
		this.node.maxDecibels = -30;
		this.node.minDecibels = -100;
		this._audioCtx = ctx;
		this._parentEl = parent;
		this._canvasObj = this.createCanvasObj();
		this._processArray = new Float32Array(this.node.frequencyBinCount);
		this._minRange = 0;
		this._maxRange = ctx.sampleRate;

	};

	p.createCanvasObj = function(){

		var canvas = document.createElement('canvas');
		canvas.className = "waveformAnalyser";
		canvas.height = this._parentEl.clientHeight;
		canvas.width = this._parentEl.clientWidth;
		this._parentEl.appendChild(canvas);
		var context = canvas.getContext("2d");

		return {el: canvas, ctx: context};

	};

	p.connect = function(node){

		node.connect(this.node);	
	};

	p.update = function(){

		this.node.getFloatFrequencyData(this._processArray);
	};

	p.render = function(){

		var ctx = this._canvasObj.ctx;
		var length = this._processArray.length;
		var fftSize = this.node.fftSize;
		var canvasWidth = this._parentEl.clientWidth;
		var canvasHeight = this._parentEl.clientHeight;
		var minDb = this.node.minDecibels;
		var maxDb = this.node.maxDecibels;
		var fy = function(y){
			y = (y-minDb)/(maxDb-minDb);
			return (1-y) * canvasHeight;
		}
		ctx.clearRect(0,0,canvasWidth, canvasHeight);
		ctx.beginPath();
		ctx.strokeStyle = "#acd";
		ctx.moveTo(0, canvasHeight);
		var iStart = Math.floor(fftSize*this._minRange/this._audioCtx.sampleRate);
		var iStop = Math.floor(fftSize*this._maxRange/this._audioCtx.sampleRate);
		var range = iStop - iStart;
		// console.log(range);
		for (var i=iStart; i< iStop;++i){
			var x = i - iStart;
			ctx.moveTo((x * canvasWidth)/range, canvasHeight);
			ctx.lineTo((x * canvasWidth)/range, fy(this._processArray[i]));
			// var testX = ((canvasWidth-30)*((i-iStart)+(i*30))/range);
			// ctx.moveTo(testX, canvasHeight);
			// ctx.lineTo(testX, fy(this._processArray[i]));
			// console.log(range);
		}
		ctx.lineTo(canvasWidth, canvasHeight);
		ctx.stroke();

	};

})();