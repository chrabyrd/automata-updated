import Automaton from './src/automaton/Automaton.mjs';
import Modal from './src/modals/modal.mjs';
import BottomPanel from './src/ui-controls/bottom-panel.mjs';


//  Begin UI setup

const bottomPanel = new BottomPanel();

// End UI Setup

const automaton = new Automaton();


// const welcomeModal = new Modal({ 
// 	htmlPath: 'src/modals/welcome-modal/welcome-modal.html',
// 	jsPath: 'src/modals/welcome-modal/welcome-modal.mjs',
// });

// welcomeModal.render();
// welcomeModal.open();

const createBoardEvent = new CustomEvent(
	'createBoard', 
	{ 
		detail: {
			boardData: {
				name: 'Board 1',
				width: 1600,
				height: 1200,
				minUnitSize: 25,
			},
		},
	},
);
document.dispatchEvent(createBoardEvent);


const createClockEvent = new CustomEvent(
	'createClock', 
	{ 
		detail: {
			clockData: {
				boardTitles:
				callback: 
			},
		},
	},
);
document.dispatchEvent(createClockEvent);
