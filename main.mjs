import createMainCanvas from './src/js/canvas.mjs';
import Entity from './src/js/entity.mjs';
import Clock from './src/js/clock.mjs';
import Compendium from './src/js/compendium.mjs';
import Modal from './src/modals/modal.mjs';
import WelcomeModal from './src/modals/welcome-modal/welcome-modal.mjs';



	const foo = new WelcomeModal();


	// console.log(foo);

	let isFoo = false;

	document.addEventListener('click', () => {
		if (!isFoo) {
			foo.open();
			isFoo = true;
		} else {
			isFoo = false;
		}
	});


	// foo.onOverlayClick(foo.close)

// // 6 is a superabundant number
// const SQUARE_LENGTH = 24;

// const { ctx } = createMainCanvas({
// 	canvasId: 'mainCanvas', 
// 	parent: document.body, 
// 	width: 2000,
// 	height: 2000,
// });

// const clock = new Clock();
// const compendium = new Compendium();

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



		// returns a set of coordinates signifying the top-left corner of the cell
		// return([
		// 	Math.floor(e.offsetX/this.cellSize.toFixed(1)) * this.cellSize,
		// 	Math.floor(e.offsetY/this.cellSize.toFixed(1)) * this.cellSize,
		// ]);