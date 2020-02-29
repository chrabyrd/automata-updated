import Automaton from './src/automaton/Automaton.mjs';
import Modal from './src/modals/modal.mjs';
import BottomPanel from './src/ui-controls/bottom-panel.mjs';

import { CGOL2dPieceData } from './examples/CGOL/entityData.mjs';


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

const MIN_UNIT_SIZE = 25;

const createBoardEvent = new CustomEvent(
	'createBoard', 
	{ 
		detail: {
			name: 'Board 1',
			width: 5000,
			height: 5000,
			minUnitSize: MIN_UNIT_SIZE,
			is2dInfinite: true,
		},
	},
);
document.dispatchEvent(createBoardEvent);


// hack to get board id
const boardId = automaton.boardController.listBoards()[0].id;;


const createEntityTypeEvent = new CustomEvent(
	'createEntityType',
	{
		detail: CGOL2dPieceData({ minUnitSize: MIN_UNIT_SIZE }),
	},
);
document.dispatchEvent(createEntityTypeEvent);


const fillBoardWithEntityTypeEvent = new CustomEvent(
	'fillBoardWithEntityType',
	{
		detail: {
			entityTypeName: 'CGOL2dPiece',
			boardId,
		},
	},
);
document.dispatchEvent(fillBoardWithEntityTypeEvent);


const setEntityClickActionEvent = new CustomEvent(
	'setEntityClickAction', 
	{ 
		detail: {
			entityTypeName: 'CGOL2dPiece',
			clickActionName: 'toggle',
		},
	},
);
document.dispatchEvent(setEntityClickActionEvent);


const createClockEvent = new CustomEvent(
	'createClock', 
	{ 
		detail: {
			boardIds: [ boardId ]
		},
	},
);
document.dispatchEvent(createClockEvent);


function step() {
  // if (progress < 20000) {
  setTimeout(() => {

		automaton.updateBoardEntities({ boardIds: [ boardId ] });
	  window.requestAnimationFrame(step);
  }, 200)
  // }
}

// setTimeout(() => {
// 	window.requestAnimationFrame(step)
// }, 8000);





