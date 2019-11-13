import { findCompatibleDimension, createMainCanvas } from './js/canvas.mjs';
import CellGrid from './js/cell-grid.mjs';

// 6 is a superabundant number
const SQUARE_LENGTH = 6;

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

const cellGrid = new CellGrid(ctx, SQUARE_LENGTH);


// mainCanvas.addEventListener('mousemove', e => {
// 	if (e.buttons === 1) {
// 		cellGrid.drawCells({
// 			cellCoords: [cellGrid.getCellCoords(e)], 
// 			cellColor: 'purple',
// 		})
// 	}
// }, false)

mainCanvas.addEventListener('click', e => {
	cellGrid.drawCells({
		cellCoords: [cellGrid.getCellCoords(e)], 
		cellColor: 'purple',
	})
}, false)