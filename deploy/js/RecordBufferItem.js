(function(){

	window.RecordBufferItem = function(){

		this._audioCtx = null;
		this.lBuffer = [];
		this.rBuffer = [];
		this.id = undefined;

		this._el = null;
	};

	var p = RecordBufferItem.prototype;

	
	p.init = function(){

		this.id = new Date().getTime();

		var el = document.createElement('div');
		el.className = 'recordedAudioBlock';
		var parent = document.getElementById('mainContainer');
		parent.appendChild(el);

		this._el = el;
	};

	p.renderSoundwave = function(){

		for (var i=0; i<this.lBuffer.length; i++){
			var innerArr = this._lBuffer[i];
			for (var z=0; z<innerArr.length;z++){
				console.log(innerArr[0]);
			}
		}
	};


})();