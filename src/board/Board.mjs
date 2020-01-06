import Compendium from '../compendium/Compendium';
import Grid from '../grid/grid.mjs';

const boardStitching = ({ boardId, startCoords, endCoords }) => ({
	boardId,
	startCoords,
	endCoords,
});

function Board({ boardData }) {
	this.id = Symbol();

	this.minUnitSize = boardData.minUnitSize;
	this.width = boardData.width;
	this.height = boardData.height;

	this.relativeWidth = this.width / this.minUnitSize;
	this.relativeHeight = this.height / this.minUnitSize;

	this.tickCount = 0;

	this.entityCompendium = new Compendium();

	this.boardStitchingReference = new BoardStitchingReference({
		boardWidth: this.relativeWidth,
		boardHeight: this.relativeHeight,
	});

	this.grid = new Grid({ ...boardData });
};

// Board.prototype.addEntity = function({ entity }) {
// 	this.entityCompendium.add({ entry: entity });

// 	this.grid.update({
// 		gridData: [{ entity.locationData, entity.image }],
// 	});
// };

// Board.prototype.removeEntity = function({ entityId }) {
// 	this.entityCompendium.remove({ id: entityId });
// };


Board.prototype.analyzeCoords = function({ coords }) {
	const boardStitchingKey = this.getBoardStitchingKey({ coords });
	
	this.boardStitchings[boardStitchingKey].forEach(boardStitching => {

	});


};1


Board.prototype.update = function({ entityInstructions }) {
	entityInstructions.forEach(instructions => {

	})
	
	this.tickCount += 1;
};

export default Board;