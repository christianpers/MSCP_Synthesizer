(function(){

	window.WaveformAnalyser = function(){

		this.node = null;
		this._parentEl = null;
		this._canvasObj = {};
		this._audioCtx = null;
		this._processArray = [];
	};

	var p = WaveformAnalyser.prototype;

	p.setup = function(ctx, parent, arrSize){

		this.node = ctx.createAnalyser();
		this._audioCtx = ctx;
		this._parentEl = parent;
		this._canvasObj = this.createCanvasObj();
		this._processArray = new Uint8Array(arrSize);

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

		this.node.getByteTimeDomainData(this._processArray);
	};

	p.render = function(){

		var ctx = this._canvasObj.ctx;
		var length = this._processArray.length;
		var canvasWidth = this._parentEl.clientWidth;
		var canvasHeight = this._parentEl.clientHeight;
		var fy = function(y){
			y = y/length;
			return (.1 + .8*y) * canvasHeight;

		}
		ctx.clearRect(0,0,canvasWidth, canvasHeight);
		ctx.beginPath();
		ctx.strokeStyle = "#acd";
		ctx.moveTo(0, fy(this._processArray[0]));
		for (var i=0; i<length; i++){
			ctx.lineTo(canvasWidth * i/length, fy(this._processArray[i]));

		}
		ctx.stroke();

	};

})();