import Grid from '../grid/Grid.mjs';


function Board({ name, width, height, minUnitSize, automatonId }) {
	this.automatonId = automatonId;
	this.name = name;
	this.id = Symbol();

	this.tickCount = 0;

	this.entityLocationReference = {};

	this.grid = this.createGrid({ width, height, minUnitSize });
};

Board.prototype.createGrid = function({ width, height, minUnitSize }) {
	const grid = new Grid({ width, height, minUnitSize });
	grid.container.id = this.name;
  grid.container.classList.add('board');

  grid.userInputLayer.canvas.addEventListener('click', e => this.boardClick(e));

  const canvasSection = document.querySelector('#canvas-section');
	canvasSection.appendChild(grid.container);

	return grid;
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

Board.prototype.getCoordData = function({ coords }) {
	const data = {
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
	      clickData: this.getCoordData({ coords }),
	    },
	  },
  );

  document.dispatchEvent(boardClickEvent);
};

export default Board;