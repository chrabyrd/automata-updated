import Compendium from '../compendium/compendium.mjs';
import StitchReference from '../tools/StitchReference.mjs';

import Grid from '../grid/Grid.mjs';


function Board({ name, width, height, minUnitSize }) {
	this.name = name;
	this.id = Symbol();

	this.tickCount = 0;

	this.minUnitSize = minUnitSize;
	this.relativeWidth = width / minUnitSize;
	this.relativeHeight = height / minUnitSize;

	this.stitchReference = new StitchReference({
		relativeBoardWidth: this.relativeWidth,
		relativeBoardHeight: this.relativeHeight,
	});

	this.entityLocationReference = {};

	this.grid = this._createGrid({ width, height, minUnitSize });
};

Board.prototype.update = function({ updates }) {
	for (const { entityId, coords, color } of updates) {
		if (this.entityLocationReference[[coords.x, coords.y]] !== entityId) {
			// need more here for movement!
			this.entityLocationReference[[coords.x, coords.y]] = entityId;
		};

		this.grid.addPendingUpdate({ coords, color })
	};

	this.grid.update();
};

Board.prototype.clear = function() {
	this.entityLocationReference = {};
	this.grid.clear();
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

Board.prototype.getEntityIdFromCoords = function({ coords }) {
	return this.entityLocationReference[[coords.x, coords.y]];
};

Board.prototype.listEntityIds = function() {
	return Object.values(this.entityLocationReference);
};

Board.prototype.incrementTickCount = function() {
	this.tickCount += 1;
};

Board.prototype._createGrid = function({ width, height, minUnitSize }) {
	const grid = new Grid({ width, height, minUnitSize, boardName: this.name, boardId: this.id });

  const canvasSection = document.querySelector('#canvas-section');
	canvasSection.appendChild(grid.container);

	return grid;
};


export default Board;