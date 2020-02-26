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

BoardController.prototype.listBoards = function() {
	return this.boardCompendium.list();
};

BoardController.prototype.updateBoards = function({ boardUpdates }) {
	const boardIds = Object.getOwnPropertySymbols(boardUpdates);

	for (const boardId of boardIds) {
		return this.updateBoard({ boardId, updates: boardUpdates[boardId] });
	};
};

BoardController.prototype.updateBoard = function({ boardId, updates }) {
	const board = this.boardCompendium.get({ id: boardId });

	board.incrementTickCount();
	return board.update({ updates });
};

BoardController.prototype.destroyBoard = function({ boardId }) {
  this.boardCompendium.remove({ id: boardId });
};

BoardController.prototype.stitchBoards = function({ board1StitchData, board2StitchData }) {
	const [ stitch1, stitch2 ] = [ 
		new Stitch({ ...board1StitchData }), 
		new Stitch({ ...board2StitchData }) 
	];

	// if (!this.areStitchesEquivalent({ stitch1, stitch2 })) { throw new Error('Stitches are not equivalent') };

	const [ board1, board2 ] = [ 
		this.boardCompendium.get({ id: stitch1.localBoard.id }),
		this.boardCompendium.get({ id: stitch2.localBoard.id }),
	];

	board1.checkStitchConflicts({ stitch: stitch1 });
	board2.checkStitchConflicts({ stitch: stitch2 });

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

	if (board.areCoordsOnBoard({ coords })) {
		const entityId = board.getEntityIdFromCoords({ coords });

		return {
			isValidSpace: true,
			isOccupiedSpace: Boolean(entityId),
			entityId,
		};
	}

	return {
		isValidSpace: false,
		isOccupiedSpace: false,
		entityId: null,
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
		const { updatedCoords, updatedBoardId } = this._getRelativeStitchData({ 
			stitch, 
			coords,
		});

		currentBoard = this.boardCompendium.get({ id: updatedBoardId });
		coords = updatedCoords;
		
		stitch = currentBoard.getStitchFromCoords({ coords });
	};

	return {
		boardId: currentBoard.id,
		coords,
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
		updatedBoardId: stitch.foreignBoard.id,
		updatedCoords,
	};
};

export default BoardController;