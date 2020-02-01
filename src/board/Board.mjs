import Compendium from '../compendium/compendium.mjs';
import StitchReference from './StitchReference.mjs'; // move to tools?

import Grid from '../grid/Grid.mjs';


function Board({ name, width, height, minUnitSize }) {
	this.name = name;
	this.id = Symbol();

	this.tickCount = 0;

	this.stitchReference = new StitchReference();

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
	this.stitchReference.checkStitchConflicts({ stitch });
};

Board.prototype.getStitchFromCoords = function({ coords }) {
	this.stitchReference.getStitchFromCoords({ coords });
};

Board.prototype.getCoordData = function({ coords }) {
	const data = {
		boardId: this.id,
		coords,
		entity: null,
		isSpaceOnBoard: false,
		stitch: null,
	};

	if (this.grid.areCoordsValid({ coords })) {
		data.isSpaceOnBoard = true;

		const entityId = this.entityLocationReference[coords];
		data.entity = this.entityCompendium.get({ id: entityId });
	} else {
		data.stich = this.stitchReference.getStitchFromCoords({ coords });
	}

	return data;
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
	  	detail: {
	    	clickData: this.getCoordData({ coords }),
	    },
		},
  );

	document.dispatchEvent(boardClickEvent);
};

export default Board;