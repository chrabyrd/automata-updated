import Modal from '../modal.mjs';


function WelcomeModal() {
	Modal.call(this);
	Modal.prototype.setInnerHTML.call(this, { htmlPath: 'src/modals/welcome-modal/welcome-modal.html' });

	this.onOverlayClick(() => {this.close()})
}

WelcomeModal.prototype = Object.create(Modal.prototype);
WelcomeModal.prototype.constructor = WelcomeModal;


export default WelcomeModal;