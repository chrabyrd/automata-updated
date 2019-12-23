import Controller from './src/controller/Controller.mjs';
import Modal from './src/modals/modal.mjs';
import BottomPanel from './src/ui-controls/bottom-panel.mjs';


//  Begin UI setup

// const bottomPanel = new BottomPanel();

//  End UI setup

const controller = new Controller();

// End Setup

// const welcomeModal = new Modal({ 
// 	htmlPath: 'src/modals/welcome-modal/welcome-modal.html',
// 	jsPath: 'src/modals/welcome-modal/welcome-modal.mjs',
// });

// welcomeModal.render();
// welcomeModal.open();



const createAutomatonEvent = new CustomEvent(
	'createAutomaton', 
	{ 
		detail: {
			gridData: {
				minUnitSize: 25,
				width: 1600,
				height: 1200,
			},
		},
	},
);

document.dispatchEvent(createAutomatonEvent);
