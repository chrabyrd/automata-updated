import Grid from './src/grid/grid.mjs';
import Entity from './src/js/entity.mjs';
import Compendium from './src/js/compendium.mjs';
import Modal from './src/modals/modal.mjs';
import BottomPanel from './src/ui-controls/bottom-panel.mjs';


//  Begin UI setup

const bottomPanel = new BottomPanel();

//  End UI setup

const gridCompendium = new Compendium();

document.addEventListener('createGridData', e => {
	const { minUnitSize, width, height } = e.detail;

	const grid = new Grid({ minUnitSize, width, height });

	gridCompendium.add({
		entry: grid,
	});
});


const entityCompendium = new Compendium();

document.addEventListener('createEntity', e => {
	const { gridId, size, coords, color } = e.detail;

	const entity = new Entity({
		color,
		coords,
		gridId,
		size,
	})

	entityCompendium.add({ entry: entity });
});


// End Setup

// const welcomeModal = new Modal({ 
// 	htmlPath: 'src/modals/welcome-modal/welcome-modal.html',
// 	jsPath: 'src/modals/welcome-modal/welcome-modal.mjs',
// });

// welcomeModal.render();
// welcomeModal.open();



const gridDataEvent = new CustomEvent(
	'createGridData', 
	{ 
		detail: {
			minUnitSize: 25,
			width: 1600,
			height: 1200,
		},
	},
);

document.dispatchEvent(gridDataEvent);


// const tickAction = () => {
// 	compendium.list().forEach(entity => {
// 		entity.imageData.color = 'blue';
// 		entity.paintToScreen({ ctx });
// 	})
// };

// mainCanvas.addEventListener('click', e => {


// 	if (e.shiftKey) {
// 		const entity = new Entity({
// 			color: 'green',
// 			coords: [e.offsetX, e.offsetY],
// 			size: SQUARE_LENGTH,
// 		})

// 		compendium.add({ entity });

// 		entity.paintToScreen({ ctx });
// 	} else {
// 		clock.tick(tickAction);
// 	}
// }, false)
