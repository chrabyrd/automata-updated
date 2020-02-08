import Compendium from '../compendium/compendium.mjs';
import StitchReference from '../tools/StitchReference.mjs';

import Grid from '../grid/Grid.mjs';


function Board({ name, width, height, minUnitSize }) {
	this.name = name;
	this.id = Symbol();

	this.tickCount = 0;

	this.absoluteWidth = width;
	this.relativeWidth = width / minUnitSize;
	this.absoluteHeight = height;
	this.relativeHeight = height / minUnitSize;

	this.stitchReference = new StitchReference({
		relativeBoardWidth: this.relativeWidth,
		relativeHeight: this.relativeHeight,
	});

	this.entityLocationReference = {};

	this.grid = this.createGrid({ width, height, minUnitSize });
};

Board.prototype.createGrid = function({ width, height, minUnitSize }) {
	const grid = new Grid({ width, height, minUnitSize });
	grid.container.id = this.name;
  grid.container.classList.add('board');

  grid.userInputLayer.canvas.addEventListener('click', e => this._handleBoardClick(e));

  const canvasSection = document.querySelector('#canvas-section');
	canvasSection.appendChild(grid.container);

	return grid;
};

Board.prototype.addStitch = function({ stitch }) {
	this.stitchReference.add({ stitch });
};

Board.prototype.removeStitch = function({ stitch }) {
	this.stitchReference.remove({ stitch });
};

Board.prototype.checkStitchConflicts = function({ stitch }) {
	// will throw errors, no need for return
	this.stitchReference.checkStitchConflicts({ stitch });
};

Board.prototype.getStitchFromCoords = function({ coords }) {
	return this.stitchReference.getStitchFromCoords({ coords });
};

Board.prototype.areCoordsOnBoard = function({ coords }) {
	return this.grid.areCoordsValid({ coords });
};

Board.prototype.getEntityFromCoords = function({ coords }) {
	return this.entityLocationReference[coords];
};

Board.prototype.listEntities = function() {
	return Object.values(this.entityLocationReference);
};

// Board.prototype.updateEntityLocationReference = function({ previousLocationData = null, entity }) {
// 	if (previousLocationData) {
// 		this.entityLocationReference[previousLocationData.coords] = null;
// 		this.grid.addPendingUpdate({ 
// 			coords: previousLocationData.coords, 
// 			entityCanvas: null,
// 		});
// 	};

// 	this.entityLocationReference[entity.locationData.coords] = entity.id;
// 	this.grid.addPendingUpdate({ 
// 		coords: entity.locationData.coords,
// 		entityCanvas: entity.canvas,
// 	});
// };


// Board.prototype.updateGrid = function() {
// 	this.grid.update();
// };

// Board.prototype.incrementTickCount = function() {
// 	this.tickCount += 1;
// };

Board.prototype._handleBoardClick = function(e) {
  const coords = this.grid.getMouseCoords();

	const boardClickEvent = new CustomEvent(
		'boardClick',
 		{
	  	detail: { coords },
		},
  );

	document.dispatchEvent(boardClickEvent);
};

export default Board;