import Compendium from '../compendium/Compendium';
import Grid from '../grid/grid.mjs';
import StitchReference from '../stitchReference/StitchReference.mjs';

import { BoardCoordData } from '../stitchReference/StitchReferenceTools.mjs'

const EMPTY = 'EMPTY';


function Board({ boardData }) {
	this.id = Symbol();

	this.minUnitSize = boardData.minUnitSize;
	this.width = boardData.width;
	this.height = boardData.height;

	this.relativeWidth = this.width / this.minUnitSize;
	this.relativeHeight = this.height / this.minUnitSize;

	this.tickCount = 0;

	this.entityCompendium = new Compendium();
	this.entityLocationReference = {};

	this.stitchReference = new StitchReference({
		boardWidth: this.relativeWidth,
		boardHeight: this.relativeHeight,
	});

	this.grid = new Grid({ ...boardData });
};

Board.prototype.updateEntityReference = function({ previousLocationData = null, entity }) {
	if (previousLocationData) {
		this.entityLocationReference[previousLocationData.coords] = null;
		this.grid.addToPendingUpdates({ 
			coords: previousLocationData.coords, 
			image: null,
		});
	};

	this.entityLocationReference[entity.locationData.coords] = entity.id;
	this.grid.addToPendingUpdates({ 
		coords: entity.locationData.coords,
		image: entity.image,
	});
};

Board.prototype.addEntity = function({ entity }) {
	this.entityCompendium.add({ entry: entity });
	this.updateEntityReference({ entity });
};

Board.prototype.removeEntity = function({ entityId }) {
	this.entityCompendium.remove({ id: entityId });
	this.updateEntityReference({ entity });
};

Board.prototype.update = function() {
	this.grid.update();
};

Board.prototype.areCoordsOnBoard = function({ coords }) {
	const reachableWidth = this.relativeWidth - 1;
	const reachableHeight = this.relativeHeight - 1;

	return ( 
		coords.x >= 0 && coords.x <= reachableWidth;
		&& coords.y >= 0 && coords.y <= reachableHeight;
	)
};

Board.prototype.calculateForeignCoordData = function({ x, y, z }) {
	const stitch = this.stitchReference.getStitchFromCoords({ ...coords });

	if (!stitch) { return {} };

	const offset = { 
		x: x - stitch.localBoardStartCoords.x,
		y: y - stitch.localBoardStartCoords.y,
		z: z - stitch.localBoardStartCoords.z,
	};

	return {
		stitch,
		offset,
	};
};

Board.prototype.analyzeCoords = function({ coords }) {
	const coordData = new BoardCoordData({
		isSpaceAvailable: false,
		isSpaceValid: false,
		entity: null,
		foreignCoordData: {},
	});

	if (this.areCoordsOnBoard({ coords })) {
		const entityId = this.entityLocationReference[coords];

		coordData.isSpaceValid = true;

		if (entityId) {
			coordData.entity = this.entityCompendium.get({ id: entityId });
		} else {
			coordData.isSpaceAvailable = true;
		};

	} else { 
		const foreignCoordData = this.calculateForeignCoordData({ ...coords });

		if (foreignCoordData) {
			coordData.isSpaceValid = true;
		}

		coordData.foreignCoordData = foreignCoordData;
	};

	return coordData;
};

Board.prototype.incrementTickCount = function() {
	this.tickCount += 1;
}

export default Board;