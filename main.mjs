import createMainCanvas from './js/canvas/canvas.mjs';

const mainCanvas = createMainCanvas({
	containerId: 'mainCanvasContainer',
	canvasId: 'mainCanvas', 
	parent: document.body, 
	width: 480, 
	height: 320,
});