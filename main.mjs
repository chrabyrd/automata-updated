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
			width: 1600,
			height: 1200,
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
				color: 'blue',
		    imageDescriptors: ['2dCGOLPiece', 'on'],
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
	    	isOn: true,
	    },
	    actionList: {
	    	toggle: function() {
	    		this.state.isOn = !this.state.isOn;
	    		this._toggleImageData();
	    	},
	    	_toggleImageData: function() {
	    		const imageDescriptors = this.state.isOn ? ['2dCGOLPiece', 'on'] : ['2dCGOLPiece', 'off'];
	    		const color = this.state.isOn ? 'blue' : null;

	    		this.updateImageData({ color, imageDescriptors });
	    	},
	    }, 
	    updateLogic: function() {
	    	const neighbors = Object.values(this.neighborhoods.actionableNeighborhood);

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
	    			actionType: UPDATE_SELF,
	    			action: this.toggle,
	    			target: null,
	    		};
	    	};

	    	return {
	    		actionType: null,
    			action: null,
    			target: null,
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
			typeName: '2dCGOLPiece',
		},
	},
);
document.dispatchEvent(setCurrentEntityCreationTypeNameEvent);

const createClockEvent = new CustomEvent(
	'createClock', 
	{ 
		detail: {
			boardIds: [ automaton.boardController.listBoards()[0].id ]
		},
	},
);
document.dispatchEvent(createClockEvent);


// hack to get board, because end-product has this behind a click event which would contain boardId

// const board = automaton.boardController.boardCompendium.list()[0];

// console.log(automaton.entityController.entityTypes['2dCGOLPiece']);

// const fillBoardWithEntityTypeEvent = new CustomEvent(
// 	'fillBoardWithEntityType',
// 	{
// 		detail: {
// 			boardId: board.id,
// 			entityType: 
// 		},
// 	},
// );


