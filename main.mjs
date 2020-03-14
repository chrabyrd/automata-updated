import Automaton from './src/automaton/Automaton.mjs';
import Modal from './src/modals/modal.mjs';
import BottomPanel from './src/ui-controls/bottom-panel.mjs';
import RightPanel from './src/ui-controls/right-panel.mjs';

import { CGOL2dPieceData } from './examples/CGOL/entityData.mjs';


//  Begin UI setup

const bottomPanel = new BottomPanel();
const rightPanel = new RightPanel();

// End UI Setup


const automaton = new Automaton();


// const welcomeModal = new Modal({ 
// 	htmlPath: 'src/modals/welcome-modal/welcome-modal.html',
// 	jsPath: 'src/modals/welcome-modal/welcome-modal.mjs',
// });

// welcomeModal.render();
// welcomeModal.open();

const MIN_UNIT_SIZE = 20;

const createBoardEvent = new CustomEvent(
	'createBoard', 
	{ 
		detail: {
			name: 'Board 1',
			width: 1200,
			height: 1200,
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
			boardIds: [ boardId ],
			tickFunc: automaton.updateBoardEntities.bind(automaton)
		},
	},
);
document.dispatchEvent(createClockEvent);



