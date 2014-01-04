(function(){

	window.EffectNode = function(){

		this._audioCtx = null;
		this._node = null;
		this._type = undefined;
	
	};

	var p = EffectNode.prototype;

	p.setup = function(ctx, type, freq){

		this._audioCtx = ctx;

		if (type == 'vol'){
			this._node = ctx.createGain();
			this._node.gain.value = freq;
		}else{
			this._node = ctx.createBiquadFilter();
			this._node.type = type;
			this.setFreq(freq);
		}

		
		this._type = type;
		

		this._minVal = undefined;
		this._maxVal = undefined;
		this._step = undefined;
	
	};

	p.createUI = function(wrapper, range){

		// var control = document.createElement('input');
		// control.className = 'control';
		// control.type = 'range';
		// control.max = range.max;
		// control.min = range.min;
		// control.step = range.step;
		// control.addEventListener('change', this._onChange.bind(this));
		var controlWrapper = document.createElement('div');
		controlWrapper.className = 'fxControlWrapper';

		var title = document.createElement('h5');
		title.innerHTML = this._type;
		title.className = 'title';


		var control = document.createElement('div');
		control.className = 'fxControl';
		this._minVal = range.min;
		this._maxVal = range.max;
		this._step = range.step;
		control.addEventListener('click', this._onClick.bind(this));
	
		controlWrapper.appendChild(title);
		controlWrapper.appendChild(control);

		wrapper.appendChild(controlWrapper);


	};

	p._onChange = function(e){

		var val = e.target.value;
		this.setFreq(val);	
	};

	p._onClick = function(e){

		
			
	};

	p.setFreq = function(freq){

		this._node.frequency.value = freq;

	};

	p.setInNode = function(node){

		node.connect(this._node);

	};

	p.getOutNode = function(){

		return this._node;

	};




})();