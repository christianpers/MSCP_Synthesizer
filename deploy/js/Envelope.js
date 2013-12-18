(function(){

	window.Envelope = function(){

		this._audioCtx = null;
		this.node = null;
		this._el = null;
		this._attack = undefined;
		this._decay = undefined;
		this._sustain = undefined;
		this._release = undefined;

		this._visualControllers = {
			attack : {
				valEl : null,
				blockEl: null,
				slider: null
			},
			decay : {
				valEl : null,
				blockEl: null,
				slider: null
			},
			sustain : {
				valEl : null,
				blockEl: null,
				slider: null
			},
			release : {
				valEl : null,
				blockEl: null,
				slider: null
			}
		}

	};

	var p = Envelope.prototype;

	p.setup = function(ctx, el, initVals){


		this._audioCtx = ctx;
		this._el = el;

		this.node = ctx.createGain();
		this.node.gain.value = 0;

		this._visualControllers.attack.blockEl = this._el.querySelector('.attack');
		this._visualControllers.attack.valEl = this._visualControllers.attack.blockEl.querySelector('.val');
		this._visualControllers.attack.slider = this._visualControllers.attack.blockEl.querySelector('input');
		this._visualControllers.attack.slider.value = initVals.att;
		this._visualControllers.attack.slider.addEventListener('change', this._onAttackChange.bind(this));

		this._visualControllers.decay.blockEl = this._el.querySelector('.decay');
		this._visualControllers.decay.valEl = this._visualControllers.decay.blockEl.querySelector('.val');
		this._visualControllers.decay.slider = this._visualControllers.decay.blockEl.querySelector('input');
		this._visualControllers.decay.slider.value = initVals.dec;
		this._visualControllers.decay.slider.addEventListener('change', this._onDecayChange.bind(this));

		this._visualControllers.sustain.blockEl = this._el.querySelector('.sustain');
		this._visualControllers.sustain.valEl = this._visualControllers.sustain.blockEl.querySelector('.val');
		this._visualControllers.sustain.slider = this._visualControllers.sustain.blockEl.querySelector('input');
		this._visualControllers.sustain.slider.value = initVals.sus;
		this._visualControllers.sustain.slider.addEventListener('change', this._onSustainChange.bind(this));

		this._visualControllers.release.blockEl = this._el.querySelector('.release');
		this._visualControllers.release.valEl = this._visualControllers.release.blockEl.querySelector('.val');
		this._visualControllers.release.slider = this._visualControllers.release.blockEl.querySelector('input');
		this._visualControllers.release.slider.value = initVals.rel;
		this._visualControllers.release.slider.addEventListener('change', this._onReleaseChange.bind(this));
		
		this._attack = initVals.att/1000;
		this._decay = initVals.dec/1000;
		this._sustain = initVals.sus/100;
		this._release = initVals.rel/1000;

		this._visualControllers.attack.valEl.innerHTML = this._attack;
		this._visualControllers.decay.valEl.innerHTML = this._decay;
		this._visualControllers.sustain.valEl.innerHTML = this._sustain;
		this._visualControllers.release.valEl.innerHTML = this._release;
	};

	p.trigger = function(time, volume){

		// console.log('env trigger', time, volume, 'attck: ',this._attack, ' decay: ',this._decay, ' sus: ',this._sustain);

		this.node.gain.cancelScheduledValues(time);
		this.node.gain.value = volume;
		this.node.gain.setValueAtTime(0, time);
		this.node.gain.linearRampToValueAtTime(volume, time + this._attack);
		this.node.gain.linearRampToValueAtTime(volume * this._sustain, time + this._attack + this._decay);
	};

	p.release = function(time){

		// console.log('env release', time);

		this.node.gain.cancelScheduledValues(0);
		this.node.gain.setValueAtTime(this.node.gain.value, time);
		this.node.gain.linearRampToValueAtTime(0, time + this._release);
	};

	p._onAttackChange = function(e){

		var val = e.target.value/1000;
		this._attack = val;
		this._visualControllers.attack.valEl.innerHTML = val;

		console.log('attack: ',val);



	};

	p._onDecayChange = function(e){

		var val = e.target.value/1000;
		this._decay = val;
		this._visualControllers.decay.valEl.innerHTML = val;
		


	};
	p._onSustainChange = function(e){

		var val = e.target.value/100;
		this._sustain = val;
		this._visualControllers.sustain.valEl.innerHTML = val;
		


	};
	p._onReleaseChange = function(e){

		var val = e.target.value/1000;
		this._release = val;
		this._visualControllers.release.valEl.innerHTML = val;
		


	};


})();