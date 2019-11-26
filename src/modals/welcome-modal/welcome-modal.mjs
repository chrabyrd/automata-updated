import Modal from '../modal.mjs';

export default function(jsModal) {
	const nextButton = document.querySelector('#welcome-modal-next-button');

	nextButton.addEventListener('click', () => {
		jsModal.close();

		const gridModal = new Modal({ 
			htmlPath: 'src/modals/grid-setup-modal/grid-setup-modal.html',
			jsPath: 'src/modals/grid-setup-modal/grid-setup-modal.mjs',
		});

		gridModal.render();
		gridModal.open();
	});
};
