function Modal() {
	this.isOpen = false;
	this.overlay = document.querySelector('#modal-overlay');
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

Modal.prototype.setInnerHTML = async function({ htmlPath }) {
	// ensure no leftover HTML between modals
	this.overlay.innerHTML = null;

	const response = await fetch(htmlPath);
	this.overlay.innerHTML = await response.text();
};

Modal.prototype.onOverlayClick = function( innerFunction ) {
	// necessary for children to wait for correct prototyping
	setTimeout(() => {
		this.overlay.addEventListener('click', e => {
			if (e.target === this.overlay) {
				innerFunction(e);
			};
		});
	}, 0);
};

export default Modal;