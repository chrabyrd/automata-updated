function Modal({ htmlPath, jsPath }) {
	this.id = Symbol();
	
	this.overlay = document.querySelector('#modal-overlay');
	this.htmlPath = htmlPath;

	this.jsPath = jsPath.replace('src/modals', '.');;

	this.isOpen = false;
};

Modal.prototype.open = function() {
	if (!this.isOpen) {
		this.overlay.classList.replace('modal--closed', 'modal--open');
		this.isOpen = true;
	}
};

Modal.prototype.close = function() {
	if (this.isOpen) {
		this.overlay.classList.replace('modal--open', 'modal--closed');
		this.isOpen = false;
	}
};

Modal.prototype.setInnerHTML = async function() {
	// ensure no leftover HTML between modals
	this.overlay.innerHTML = null;

	const response = await fetch(this.htmlPath);
	const responseText = await response.text();
	this.overlay.innerHTML = responseText;
};

Modal.prototype.executeJS = async function() {
	const {default: jsModule} = await import(this.jsPath);
	jsModule(this);  // pass in Modal reference
};

Modal.prototype.render = async function() {
	// need synchronicity between async elements
	await this.setInnerHTML();
	await this.executeJS();
};

export default Modal;