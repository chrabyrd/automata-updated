import Compendium from '../compendium/Compendium.mjs';
import Grid from '../grid/Grid.mjs';


function Board({ width, height, minUnitSize, automatonId }) {
	this.automatonId = automatonId;
	this.id = Symbol();

	this.tickCount = 0;

	this.entityCompendium = new Compendium();
	this.entityLocationReference = {};

	this.grid = new Grid({ width, height, minUnitSize });
	
	this.grid.addToDocument();
  this.grid.userInputLayer.canvas.addEventListener('click', e => this.boardClick(e));
};

Board.prototype.addEntity = function({ entity }) {
	this.entityCompendium.add({ entry: entity });
	this.updateEntityLocationData({ entity });
	this.updateGrid();
};

Board.prototype.removeEntity = function({ entityId }) {
	this.entityCompendium.remove({ id: entityId });
	this.updateEntityLocationData({ entity });
	this.updateGrid();
};

Board.prototype.updateEntityLocationData = function({ previousLocationData = null, entity }) {
	if (previousLocationData) {
		this.entityLocationReference[previousLocationData.coords] = null;
		this.grid.addPendingUpdate({ 
			coords: previousLocationData.coords, 
			entityCanvas: null,
		});
	};

	this.entityLocationReference[entity.locationData.coords] = entity.id;
	this.grid.addPendingUpdate({ 
		coords: entity.locationData.coords,
		entityCanvas: entity.canvas,
	});
};

Board.prototype.analyzeCoords = function({ coords }) {
	const data = {
		automatonId: this.automatonId,
		boardId: this.id,
		coords,
		entity: null,
		isSpaceOnBoard: false,
	};

	if ( 
		//  coords are on board
		coords.x >= 0 
		&& coords.x <= this.grid.maxReachableWidth
		&& coords.y >= 0 
		&& coords.y <= this.grid.maxReachableHeight
	) {
		data.isSpaceOnBoard = true;

		const entityId = this.entityLocationReference[coords];

		if (entityId) {
			data.entity = this.entityCompendium.get({ id: entityId });
		};
	};

	return data;
};

Board.prototype.updateGrid = function() {
	this.grid.update();
};

Board.prototype.incrementTickCount = function() {
	this.tickCount += 1;
};

Board.prototype.boardClick = function(e) {
  const coords = this.grid.getMouseCoords();

  const boardClickEvent = new CustomEvent(
   'boardClick',
   {
	    detail: {
	      clickData: this.analyzeCoords({ coords }),
	    },
	  },
  );

  document.dispatchEvent(boardClickEvent);
};

export default Board;