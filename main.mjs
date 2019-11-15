import { findCompatibleDimension, createMainCanvas } from './js/canvas.mjs';
import Entity from './js/entity.mjs';
import Clock from './js/clock.mjs';
import Compendium from './js/compendium.mjs';

// 6 is a superabundant number
const SQUARE_LENGTH = 24;

const CANVAS_WIDTH = findCompatibleDimension({
	squareLength: SQUARE_LENGTH,
	clientLength: window.innerWidth,
});

const CANVAS_HEIGHT = findCompatibleDimension({
	squareLength: SQUARE_LENGTH,
	clientLength: window.innerHeight,
});


const { ctx } = createMainCanvas({
	containerId: 'mainCanvasContainer',
	canvasId: 'mainCanvas', 
	parent: document.body, 
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
});

const clock = new Clock();
const compendium = new Compendium();

const tickAction = () => {
	compendium.list().forEach(entity => {
		entity.imageData.color = 'blue';
		entity.paintToScreen({ ctx });
	})
};

mainCanvas.addEventListener('click', e => {
	if (e.shiftKey) {
		const entity = new Entity({
			color: 'green',
			coords: [e.offsetX, e.offsetY],
			size: SQUARE_LENGTH,
		})

		compendium.add({ entity });

		entity.paintToScreen({ ctx });
	} else {
		clock.tick(tickAction);
	}
}, false)


		// returns a set of coordinates signifying the top-left corner of the cell
		// return([
		// 	Math.floor(e.offsetX/this.cellSize.toFixed(1)) * this.cellSize,
		// 	Math.floor(e.offsetY/this.cellSize.toFixed(1)) * this.cellSize,
		// ]);