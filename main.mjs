import Grid from './src/grid.mjs';
import Entity from './src/js/entity.mjs';
import Clock from './src/js/clock.mjs';
import Compendium from './src/js/compendium.mjs';
import Modal from './src/modals/modal.mjs';


const gridCompendium = new Compendium();

document.addEventListener('createGridData', e => {
	const { unitSize, width, height } = e.detail;

	const grid = new Grid({ unitSize, width, height });

	gridCompendium.add({
		entry: grid,
	});
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
			unitSize: 25,
			width: 800,
			height: 600,
		},
	},
);

document.dispatchEvent(gridDataEvent);



const clock = new Clock();
const entityCompendium = new Compendium();

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
