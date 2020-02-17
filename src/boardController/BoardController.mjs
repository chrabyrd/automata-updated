import Board from '../board/Board.mjs';
import Compendium from '../compendium/compendium.mjs';

import { Stitch } from '../tools/dataTypes.mjs';


function BoardController() {
  this.boardCompendium = new Compendium();

  document.addEventListener('createBoard', e => this.createBoard({ ...e.detail }));
};

BoardController.prototype.createBoard = function({ width, height, minUnitSize, name }) {
  const board = new Board({ width, height, minUnitSize, name });
  this.boardCompendium.add({ entry: board });

  return board;
};

BoardController.prototype.getBoard = function({ boardId }) {
	return this.boardCompendium.get({ id: boardId });
};

BoardController.prototype.updateBoards = function({ pendingLocationData }) {
	const boardIds = Object.keys(pendingLocationData);

	boardIds.forEach(boardId => {
		this.updateBoard({
			boardId,
			updates: pendingLocationData[boardId],
			shouldTick: true,
		})
	});
};

BoardController.prototype.updateBoard = function({ boardId, updates, shouldTick=false }) {
	const board = this.boardCompendium.get({ id: boardId });

	updates.forEach(update => {
		board.updateEntityLocationReference({
			canvas: update.canvas,
			coords: update.coords,
			entityId: update.entityId,
		})
	});

	if (shouldTick) { board.incrementTickCount() };
	board.updateGrid();
};

BoardController.prototype.destroyBoard = function({ boardId }) {
  this.boardCompendium.remove({ id: boardId });
};

BoardController.prototype.stitchBoards = function({ board1StitchData, board2StitchData }) {
	const [ stitch1, stitch2 ] = [ 
		new Stitch({ ...board1StitchData }), 
		new Stitch({ ...board2StitchData }) 
	];

	if (!this.areStitchesEquivalent({ stitch1, stitch2 })) { throw new Error('Stitches are not equivalent') };

	const [ board1, board2 ] = [ 
		this.boardCompendium.get({ id: this.stitch1.localBoard.id }),
		this.boardCompendium.get({ id: this.stitch2.localBoard.id }),
	];

	board1.checkStichConflicts({ stitch: stitch1 });
	board2.checkStichConflicts({ stitch: stitch2 });

	// If the compiler makes it here without throwing an error, the stitches are good to be added.
	board1.addStitch({ stitch: stitch1 });
	board2.addStitch({ stitch: stitch2 });
};

BoardController.prototype.unstitchBoards = function({ boardId, coords }) {
	const board1 = this.boardCompendium.get({ id: boardId });
	const stitch1 = board1.getStitchFromCoords({ coords });

	const board2 = this.boardCompendium.get({ id: stitch.foreignBoard.id });
	const stitch2 = board2.getStitchFromCoords({ coords: foreignBoard.startCoords });

	board1.removeStitch({ stitch: stitch1 });
	board2.removeStitch({ stitch: stitch2 });
};

BoardController.prototype.getBoardDataFromAbsoluteCoordData = function({ boardId, coords }) {
	const board = this.boardCompendium.get({ id: boardId });

	if (board.areCoordOnBoard({ coords })) {
		return {
			isValidSpace: true,
			occupiedSpaceEntityId: board.getEntityIdFromCoords({ coords: relativeCoordData.coords }),
		};
	}

	return {
		isValidSpace: false,
		occupiedSpaceEntityId: null,
	};
};

BoardController.prototype.getAbsoluteCoordDataFromRelative = function({ referenceBoardId, referenceCoords, relativeCoords }) {
	let currentBoard = this.boardCompendium.get({ id: referenceBoardId });

	let coords = {
    x: referenceCoords.x + relativeCoords.x,
    y: referenceCoords.y + relativeCoords.y,
    z: referenceCoords.z + relativeCoords.z,
  };

	let stitch = currentBoard.getStitchFromCoords({ coords });

	while (stitch) {
		const { updatedCoords, boardId } = this._getRelativeStitchData({ 
			stitch, 
			coords: updatedCoords,
		});

		currentBoard = this.boardCompendium.get({ id: boardId });
		coords = updatedCoords;
		stitch = currentBoard.getStitchFromCoords({ updatedCoords });
	};

	return {
		boardId: currentBoard.id,
		coords: updatedCoords,
	};
};

BoardController.prototype._getRelativeStitchData = function({ stitch, coords }) {
	const board = this.boardCompendium.get({ id: stitch.foreignBoard.id });

	const offset = { 
		x: coords.x - stitch.localBoard.startCoords.x,
		y: coords.y - stitch.localBoard.startCoords.y,
		z: coords.z - stitch.localBoard.startCoords.z,
	};

	const updatedCoords = { ...stitch.foreignBoard.startCoords };

	if (stitch.foreignBoard.startCoords.x === board.relativeWidth) {
	  updatedCoords.x -= offset.x
	} else {
	  updatedCoords.x += offset.x
	};

	if (stitch.foreignBoard.startCoords.y === board.relativeHeight) {
	  updatedCoords.y -= offset.y
	} else {
	  updatedCoords.y += offset.y
	};

	return {
		boardId: foreignBoard.id,
		coords: updatedCoords,
	};
};

export default BoardController;