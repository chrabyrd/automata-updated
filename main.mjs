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
			type: '2dCGOLPiece',
			color: null,
	    imageDescriptors: [],
	    neighborhoodBlueprint: {
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
	    actionList: {
	    	toggle: () => {
	    		this.state.isOn = !this.state.isOn;
	    		this.updateImageData();
	    	},
	    	updateImageData: () => {
	    		this.imageDescriptors = this.state.isOn ? ['2dCGOLPiece', 'on'] : [];
	    		this.color = this.state.isOn && 'blue';
	    	},
	    }, 
	    updateRules: () => {
	    	const neighbors = Object.values(this.neighborhoods.actionableNeighborhood);

	    	const activeNeighborCount = neighbors.reduce((count, neighbor) => {
	    		if (neighbor.state.isOn) return count +=1;
	    	}, 0);

	    	if (
	    		this.state.isOn && activeNeighborCount < 2
	    		|| this.state.isOn && activeNeighborCount > 3
	    		|| !this.state.isOn && activeNeighborCount === 3
	    	) {
	    		this.toggle();
	    	};
	    },
		},
	},
);
document.dispatchEvent(createEntityTypeEvent);


// hack to get board, because end-product has this behind a click event which would contain boardId

// const board = 


// const createClockEvent = new CustomEvent(
// 	'createClock', 
// 	{ 
// 		detail: {
// 			clockData: {
// 				boardTitles: [`Board 1`],
// 				callback: []
// 			},
// 		},
// 	},
// );
// document.dispatchEvent(createClockEvent);