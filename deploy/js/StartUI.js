(function(){

	window.StartUI = function(){

		this._el = null;
		this._children = [];

		this._mixer = null;
	};

	var p = StartUI.prototype;

	StartUI.ITEM_HEIGHT = 140;

	p.setup = function(el){

		this._el = el;

		this._mixer = new Mixer();
		this._mixer.setup(document.getElementById('mainContainer'));

		for (var i=0;i<el.children.length;i++){
			var child = el.children[i];
			var type = child.dataset['type'];
			child.style.top = StartUI.ITEM_HEIGHT * i + 'px';

			var obj = {el: child, expanded: false, type: type, content: child.querySelector('.content')};
			child.querySelector('h3').addEventListener('click', this._onClick.bind(this));
			this._children.push(obj);
		}
	};

	p._onClick = function(e){

		var obj = this._getChildObj(e.target.parentNode);
		if (obj.expanded)
			this._showChildren();

		else{
			this._hideChildren(e.target.parentNode);
			
		}
			
	};

	p._getChildObj = function(target){

		for (var i=0;i<this._children.length; i++){
			var child = this._children[i];
			if (child.el == target){
				return child;
			}
		}
	};

	p._showChildren = function(target){

		for (var i=0;i<this._children.length; i++){
			var child = this._children[i];
			
			// child.el.style.display = 'block';
			child.el.style.zIndex = 1;
			child.el.style.top = StartUI.ITEM_HEIGHT * i + 'px';
			// child.el.style.position = 'relative';
			child.expanded = false;
			this.hideContent(child.type);
		}
	};

	p._hideChildren = function(target){

		for (var i=0;i<this._children.length; i++){
			var child = this._children[i];
			if (child.el == target){
				child.expanded = true;
				// child.el.style.display = 'block';
				child.el.style.zIndex = 3;
				child.el.style.position = 'absolute';
				child.el.style.top = 0;
				this.showContent(child.type);
				
			}else{
				child.expanded = false;
				child.el.style.zIndex = 1;
				// child.el.style.display = 'none';
				// child.el.style.position = 'relative';
				this.hideContent(child.type);
			}
		}
	};

	p.showContent = function(type){

		if (type == 'mic'){
			this._mixer.showMicRecord();
		}
		if (type == 'sequencer'){
			this._mixer.showSequencer();
		}
		if (type == 'synthesizer'){
			this._mixer.showSynthesizer();
		}

	};

	p.hideContent = function(type){

		if (type == 'mic'){
			this._mixer.hideMicRecord();
		}
		if (type == 'sequencer'){
			this._mixer.hideSequencer();
		}
		if (type == 'synthesizer'){
			this._mixer.hideSynthesizer();
		}

	};



})();