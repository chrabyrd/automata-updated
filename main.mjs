import Automaton from './src/automaton/Automaton.mjs';
import Modal from './src/modals/modal.mjs';
import BottomPanel from './src/ui-controls/bottom-panel.mjs';

import { UPDATE_SELF } from './src/tools/constants.mjs';


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
			name: 'Board 1',
			width: 1200,
			height: 800,
			minUnitSize: 25,
		},
	},
);
document.dispatchEvent(createBoardEvent);


const createEntityTypeEvent = new CustomEvent(
	'createEntityType',
	{
		detail: {
			typeName: '2dCGOLPiece',
			imageData: {
				color: null,
		    imageDescriptors: ['2dCGOLPiece', 'off'],
			},
			size: 25,
	    neighborhoodBlueprints: {
	      actionableNeighborhood: [
	        { x: -1, y: -1, z: 0, },
	        { x: 0, y: -1, z: 0, },
	        { x: 1, y: -1, z: 0, },
	        { x: 1, y: 0, z: 0, },
	        { x: 1, y: 1, z: 0, },
	        { x: 0, y: 1, z: 0, },
	        { x: -1, y: 1, z: 0, },
	        { x: -1, y: 0, z: 0, },
	      ],
	      unactionableNeighborhood: [],
	    },
	    state: {
	    	isOn: false,
	    },
	    actions: {
	    	toggle: function() {
	    		this.state.isOn = !this.state.isOn;

	    		const imageDescriptors = this.state.isOn ? ['2dCGOLPiece', 'on'] : ['2dCGOLPiece', 'off'];
	    		const color = this.state.isOn ? 'blue' : null;

	    		this.updateImageData({ color, imageDescriptors });

	    		return { entityId: this.id };
	    	},
	    }, 
	    updateLogic: function({ neighborhoodData }) {
	    	const neighbors = Object.values(neighborhoodData.actionableNeighborhood);

	    	const activeNeighborCount = neighbors.reduce((count, neighborData) => {
	    		if (neighborData.imageDescriptors.includes('on')) { count += 1 };
	    		return count;
	    	}, 0);

	    	if (
	    		this.state.isOn && activeNeighborCount < 2
	    		|| this.state.isOn && activeNeighborCount > 3
	    		|| !this.state.isOn && activeNeighborCount === 3
	    	) {
	    		return {
	    			entityId: this.id,
	    			action: this.actions.toggle,
	    		};
	    	};

	    	return {
	    		entityId: this.id,
	    		action: null,
	    	};

	    },
		},
	},
);
document.dispatchEvent(createEntityTypeEvent);


const setCurrentEntityCreationTypeNameEvent = new CustomEvent(
	'setCurrentEntityCreationTypeName', 
	{ 
		detail: {
			entityTypeName: '2dCGOLPiece',
		},
	},
);
document.dispatchEvent(setCurrentEntityCreationTypeNameEvent);


const fillBoardWithEntityTypeEvent = new CustomEvent(
	'fillBoardWithEntityType',
	{
		detail: {
			entityTypeName: '2dCGOLPiece',
			entitySize: 25,
			boardId: automaton.boardController.listBoards()[0].id,
		},
	},
);
document.dispatchEvent(fillBoardWithEntityTypeEvent);


const setEntityClickActionEvent = new CustomEvent(
	'setEntityClickAction', 
	{ 
		detail: {
			entityTypeName: '2dCGOLPiece',
			clickActionName: 'toggle',
		},
	},
);
document.dispatchEvent(setEntityClickActionEvent);


const createClockEvent = new CustomEvent(
	'createClock', 
	{ 
		detail: {
			boardIds: [ automaton.boardController.listBoards()[0].id ]
		},
	},
);
document.dispatchEvent(createClockEvent);

const boardId = automaton.boardController.listBoards()[0].id;

const board = automaton.boardController.boardCompendium.get({ id: boardId });


// top-left corner to bottom-right corner
automaton.boardController.stitchBoards({
	board1StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: -1, y: -1, z: 0}, 
		localBoardEndCoords: {x: -1, y: -1, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: board.relativeWidth - 1, y: board.relativeHeight - 1, z: 0},
		foreignBoardEndCoords: {x: board.relativeWidth - 1, y: board.relativeHeight - 1, z: 0},
	},
	board2StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: board.relativeWidth, y: board.relativeHeight, z: 0}, 
		localBoardEndCoords: {x: board.relativeWidth, y: board.relativeHeight, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: 0, y: 0, z: 0},
		foreignBoardEndCoords: {x: 0, y: 0, z: 0},
	},
});

// top-right corner to bottom-left corner
automaton.boardController.stitchBoards({
	board1StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: board.relativeWidth, y: -1, z: 0}, 
		localBoardEndCoords: {x: board.relativeWidth, y: -1, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: 0, y: board.relativeHeight - 1, z: 0},
		foreignBoardEndCoords: {x: 0, y: board.relativeHeight - 1, z: 0},
	},
	board2StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: -1, y: board.relativeHeight, z: 0}, 
		localBoardEndCoords: {x: -1, y: board.relativeHeight, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: board.relativeWidth - 1, y: 0, z: 0},
		foreignBoardEndCoords: {x: board.relativeWidth - 1, y: 0, z: 0},
	},
});

// left side to right side
automaton.boardController.stitchBoards({
	board1StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: -1, y: 0, z: 0}, 
		localBoardEndCoords: {x: -1, y: board.relativeHeight - 1, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: board.relativeWidth - 1, y: 0, z: 0},
		foreignBoardEndCoords: {x: board.relativeWidth - 1, y: board.relativeHeight - 1, z: 0},
	},
	board2StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: board.relativeWidth, y: 0, z: 0}, 
		localBoardEndCoords: {x: board.relativeWidth, y: board.relativeHeight - 1, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: 0, y: 0, z: 0},
		foreignBoardEndCoords: {x: 0, y: board.relativeHeight - 1, z: 0},
	},
});

// top to bottom
automaton.boardController.stitchBoards({
	board1StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: 0, y: -1, z: 0}, 
		localBoardEndCoords: {x: board.relativeWidth - 1, y: -1, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: 0, y: board.relativeHeight - 1, z: 0},
		foreignBoardEndCoords: {x: board.relativeWidth - 1, y: board.relativeHeight - 1, z: 0},
	},
	board2StitchData: {
		localBoardId: boardId,
		localBoardStartCoords: {x: 0, y: board.relativeHeight, z: 0}, 
		localBoardEndCoords: {x: board.relativeWidth - 1, y: board.relativeHeight, z: 0}, 
		foreignBoardId: boardId,
		foreignBoardStartCoords: {x: 0, y: 0, z: 0},
		foreignBoardEndCoords: {x: board.relativeWidth - 1, y: 0, z: 0},
	},
});

	setInterval(function() {
	  automaton.updateBoardEntities({
	    boardIds: [ automaton.boardController.listBoards()[0].id ]
	  })
	}, 60);



