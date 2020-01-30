import Board from '../board/Board.mjs';
import Compendium from '../compendium/compendium.mjs';
import StitchReference from './StitchReference.mjs';


function BoardController() {
  this.boardCompendium = new Compendium();
	this.stitchReferenceCompendium = new Compendium();
	this.reflexiveStitches = {};
};

BoardController.prototype.createBoard = function({ width, height, name }) {
  const board = new Board({
    name,
    width,
    height,
    minUnitSize: this.minUnitSize,
    automatonId: this.id,
  });

  this.boardCompendium.add({ entry: board });
};

BoardController.prototype.deleteBoard = function({ boardId }) {
  this.boardCompendium.remove({ id: boardId });
};

BoardController.prototype.updateBoards = function({ boardIds }) {
  const boards = boardIds.map(boardId => this.boardCompendium.get({ id: boardId }));

  boards.forEach(board => board.incrementTickCount());

  const shuffledEntities = shuffle({
    array: boards.reduce((acc, board) => (
      acc.concat(board.entityCompendium.list())
    ), []),
  });

  shuffledEntities.forEach(entity => this._updateEntity({ entity }));

  this.boardCompendium.list().forEach(board => board.updateGrid());
};

BoardController.prototype.stitchBoards = function({ board1StitchingData, board2StitchingData }) {
	const validStitches = [board1StitchingData, board2StitchingData].reduce((acc, stitchingData) => {
		const stitch = new Stitch({
			localBoardId: stitchingData.localBoard.id,
			localBoardStartCoords: stitchingData.localBoard.startCoords, 
			localBoardEndCoords: stitchingData.localBoard.endCoords, 
			foreignBoardId: stitchingData.foreignBoard.id,
			foreignBoardStartCoords: stitchingData.foreignBoard.startCoords,
			foreignBoardEndCoords: stitchingData.foreignBoard.endCoords,
		});

		if (this._isStitchValid({ stitch })) { return stitch };
	}, []);

	//  Should throw error before now if invalid, but no harm in redudant check
	if (validStitches.length !== 2) { return };

	const stitch1 = validStitches[0];
	const stitch2 = validStitches[1];

	this.reflexiveStitches[[stitch1[localBoardId], stitch1[localBoardStartCoords]]] = [stitch2[localBoardId], stitch2[localBoardStartCoords]];
	this.reflexiveStitches[[stitch2[localBoardId], stitch2[localBoardStartCoords]]] = [stitch1[localBoardId], stitch1[localBoardStartCoords]];

	validStitches.forEach(stitch => this._addStitch({ stitch }));
};

BoardController.prototype.unstitchBoards = function({ stitch }) {
  const foreignStitchData = this.reflexiveStitches[[stitch[localBoardId], stitch[localBoardStartCoords]]];
  const foreignStitchReference = this.stitchReferenceCompendium.get({ id: foreignStitchData[0] });

  const foreignStitch = foreignStitchReference.getStitchFromCoords({ coords: foreignStitchData[1] });

  this._removeStitch({ stitch });
  this._removeStitch({ foreignStitch });

  delete this.reflexiveStitches[[stitch[localBoardId], stitch[localBoardStartCoords]]];
  delete this.reflexiveStitches[[foreignStitch[localBoardId], foreignStitch[localBoardStartCoords]]];
};

BoardController.prototype.getStitchData = function({ boardId, coords }) {
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

BoardController.prototype._findRelativeCoordData = function({ currentBoardId, referenceCoords, relativeCoords }) {
  let coordData = null;

  do {
    let boardData;

    if (coordData) {
      const board = this.boardCompendium.get({ id: coordData.boardId });
      boardData = board.analyzeCoords({ ...coordData.coords });
    } else {
      const board = this.boardCompendium.get({ id: currentBoardId });

      boardData = board.analyzeCoords({
        x: referenceCoords.x + relativeCoords.x,
        y: referenceCoords.y + relativeCoords.y,
        z: referenceCoords.z + relativeCoords.z,
      });
    };

    coordData = {};

    if (boardData.isSpaceOnBoard) {
      coordData.boardId = boardData.id;
      coordData.coords = boardData.coords;
      coordData.entity = boardData.entity;
      coordData.isSpaceAvailable = !Boolean(boardData.entity)
    } else {
      const { stitch, updatedCoords } = this.getStitchData({
        boardId: boardData.id,
        coords: boardData.coords,
      });

      if (stitch) {
        coordData.boardId = stitch.foreignBoardId;
        coordData.coords = updatedCoords;
      };
    };
  } while (coordData.boardId && !coordData.entity && !coordData.isSpaceAvailable);

  return coordData;
};

BoardController.prototype._createStitchReference = function({ boardId }) {
	const board = this.boardCompendium.get({ id: boardId });

	this.stitchReferenceCompendium.add({ 
		entry: {
			id: board.id,
			stitchReference: new StitchReference({ 
				boardRelativeWidth: board.relativeWidth,
				bordRelativeHeight: board.relativeHeight,
			}),
		},
	});
};

BoardController.prototype._doesBoardHaveStitchReference = function({ boardId }) {
	return Boolean(this.stitchReferenceCompendium.get({ id: boardId }));
};

BoardController.prototype._addStitch = function({ stitch }) {
	const boardId = stitch.localBoardId;

	if (!this._doesBoardHaveStitchReference({ boardId })) {
		this._createStitchReference({ boardId });
	};

	const stitchReference = this.stitchReferenceCompendium.get({ id: boardId });
	stitchReference.add({ stitch });
};

BoardController.prototype._removeStitch = function({ stitch }) {
	const stitchReference = this.stitchReferenceCompendium.get({ id: stitch.localBoardId });
	stitchReference.remove({ stitch });
};

export default BoardController;