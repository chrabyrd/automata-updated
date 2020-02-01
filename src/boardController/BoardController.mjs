import Board from '../board/Board.mjs';
import Compendium from '../compendium/compendium.mjs';

import { Stitch } from '../tools/dataTypes.mjs';


function BoardController() {
  this.boardCompendium = new Compendium();
};

BoardController.prototype.createBoard = function({ width, height, minUnitSize, name }) {
  const board = new Board({ width, height, minUnitSize, name });
  this.boardCompendium.add({ entry: board });

  return board;
};

BoardController.prototype.getBoard = function({ boardId }) {
	return this.boardCompendium.get({ id: boardId });
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

BoardController.prototype.getCoordData = function({ currentBoardId, referenceCoords, relativeCoords }) {
  // let coordData;

  // do {
  //   let boardData;

  //   if (coordData) {
  //     const board = this.boardCompendium.get({ id: coordData.boardId });
  //     boardData = board.getCoordData({ ...coordData.coords });
  //   } else {
  //     const board = this.boardCompendium.get({ id: currentBoardId });

  //     boardData = board.getCoordData({
  //       x: referenceCoords.x + relativeCoords.x,
  //       y: referenceCoords.y + relativeCoords.y,
  //       z: referenceCoords.z + relativeCoords.z,
  //     });
  //   };

  //   coordData = {};

  //   if (boardData.isSpaceOnBoard) {
  //     coordData.boardId = boardData.id;
  //     coordData.coords = boardData.coords;
  //     coordData.entity = boardData.entity;
  //     coordData.isSpaceAvailable = !Boolean(boardData.entity)
  //   } else {
  //     const { stitch, updatedCoords } = this._getStitchData({
  //       boardId: boardData.id,
  //       coords: boardData.coords,
  //     });

  //     if (stitch) {
  //       coordData.boardId = stitch.foreignBoardId;
  //       coordData.coords = updatedCoords;
  //     };
  //   };
  // } while (coordData.boardId && !coordData.entity && !coordData.isSpaceAvailable);

  // return coordData;
};

BoardController.prototype._getStitchData = function({ boardId, coords }) {
	const stitchReference = this.stitchReferenceCompendium.get({ id: boardId });
	const stitch = stitchReference.getStitchFromCoords({ coords });

	if (!stitch) { throw new Error("Cannot locate stitch") };

	const foreignBoard = this.boardCompendium.get({ id: stitch.foreignBoardId });

	const offset = { 
		x: coords.x - stitch.localBoardStartCoords.x,
		y: coords.y - stitch.localBoardStartCoords.y,
		z: coords.z - stitch.localBoardStartCoords.z,
	};

	const updatedCoords = { ...stitch.foreignBoardStartCoords };

	if (stitch.foreignBoardStartCoords.x === foreignBoard.relativeWidth) {
	  updatedCoords.x -= offset.x
	} else {
	  updatedCoords.x += offset.x
	};

	if (stitch.foreignBoardStartCoords.y === foreignBoard.relativeHeight) {
	  updatedCoords.y -= offset.y
	} else {
	  updatedCoords.y += offset.y
	};

	return {
		stitch,
		updatedCoords,
	};
};

export default BoardController;