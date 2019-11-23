function Modal({ isOpen, htmlPath, jsPath }) {
	this.overlay = document.querySelector('#modal-overlay');
	this.htmlPath = htmlPath;
	this.jsPath = jsPath;

	this.renderHTML();
	this.executeJS();

	this.isOpen = !isOpen;
	this.open();
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

Modal.prototype.renderHTML = async function() {
	// ensure no leftover HTML between modals
	this.overlay.innerHTML = null;

	const response = await fetch(this.htmlPath);
	const responseText = await response.text();
	this.overlay.innerHTML = responseText;
};

Modal.prototype.executeJS = async function() {
	const {default: jsModule} = await import(this.jsPath);
	jsModule();
};

export default Modal;