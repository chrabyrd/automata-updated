import Compendium from '../compendium/Compendium';
import Grid from '../grid/grid.mjs';


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

Board.prototype.analyzeCoords = function({ coords }) {
	data = {
		boardId: this.id,
		coords,
		entity: null,
		isSpaceOnBoard: false,
	};

	if ( 
		//  coords are on board
		coords.x >= 0 
		&& coords.x <= this.relativeWidth - 1
		&& coords.y >= 0 
		&& coords.y <= this.relativeHeight - 1
	) {
		data.isOnBoard = true;

		const entityId = this.entityLocationReference[coords];

		if (entityId) {
			data.entity = this.entityCompendium.get({ id: entityId });
		};
	};

	return data;
};

Board.prototype.incrementTickCount = function() {
	this.tickCount += 1;
}

export default Board;