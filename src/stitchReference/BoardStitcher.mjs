import StitchReference from './StitchReference.mjs';

import { Stitch } from '../tools/dataTypes.mjs';

function BoardStitcher({ boardCompendium }) {
	this.boardCompendium = boardCompendium;
	this.stitchReferenceCompendium = new Compendium();
	this.reflexiveStitches = {};
};

BoardStitcher.prototype.createStitchReference = function({ boardId }) {
	const board = this.boardCompendium.get({ id: boardId });

	this.stitchReferenceCompendium.add({ 
		entry: {
			id: board.id,
			stitchReference: new StitchReference({ 
				boardWidth: board.width,
				bordHeight: board.height,
			}),
		},
	});
};

BoardStitcher.prototype.doesBoardHaveStitchReference = function({ boardId }) {
	return Boolean(this.stitchReferenceCompendium.get({ id: boardId }));
};

BoardStitcher.prototype.addStitch = function({ stitch }) {
	const boardId = stitch.localBoardId;

	if (!this.doesBoardHaveStitchReference({ boardId })) {
		this.createStitchReference({ boardId });
	};

	const stitchReference = this.stitchReferenceCompendium.get({ id: boardId });
	stitchReference.add({ stitch });
};

BoardStitcher.prototype.removeStitch = function({ stitch }) {
	const stitchReference = this.stitchReferenceCompendium.get({ id: stitch.localBoardId });
	stitchReference.remove({ stitch });
};

BoardStitcher.prototype.isStitchValid = function({ stitch }) {
	const errors = [];

	if (!this.areStitchDimensionsEqual({ stitch })) {
		errors.push(new Error('Need equal stitch dimensions'));
	};

	const conflictingStitches = this.stitchReference.getConflictingStitches({ stitch });

	if (conflictingStitches) {
		conflictingStitches.forEach(stitch => {
			errors.push(new Error(`conflicting stitch ${stitch}`));
		});
	};

	if (errors.length) {
		throw new Error(errors);
	};
};

BoardStitcher.prototype.areStitchDimensionsEqual = function({ stitch }) {
  const getDimensions = ({ startCoords, endCoords }) => ({
    x: endCoords.x - startCoords.x,
    y: endCoords.y - startCoords.y,
  });

  const localBoardStitchDimensions = getDimensions({
    startCoords: stitch.localBoardStartCoords,
    endCoords: stitch.localBoardEndCoords,
  });

  const foreignBoardStitchDimensions = getDimensions({
    startCoords: stitch.foreignBoardStartCoords,
    endCoords: stitch.foreignBoardEndCoords,
  });

  return (
    localBoardStitchDimensions.x === foreignBoardStitchDimensions.x
    && localBoardStitchDimensions.y === foreignBoardStitchDimensions.y
  );
};

BoardStitcher.prototype.stitchBoards = function({ board1StitchingData, board2StitchingData }) {
	const validStitches = [board1StitchingData, board2StitchingData].reduce((acc, stitchingData) => {
		const stitch = new Stitch({
			localBoardId: stitchingData.localBoard.id,
			localBoardStartCoords: stitchingData.localBoard.startCoords, 
			localBoardEndCoords: stitchingData.localBoard.endCoords, 
			foreignBoardId: stitchingData.foreignBoard.id,
			foreignBoardStartCoords: stitchingData.foreignBoard.startCoords,
			foreignBoardEndCoords: stitchingData.foreignBoard.endCoords,
		});

		if (this.isStitchValid({ stitch })) { return stitch };
	}, []);

	//  Should throw error before now if invalid, but no harm in redudant check
	if (validStitches.length !== 2) { return };

	const stitch1 = validStitches[0];
	const stitch2 = validStitches[1];

	this.reflexiveStitches[[stitch1[localBoardId], stitch1[localBoardStartCoords]]] = [stitch2[localBoardId], stitch2[localBoardStartCoords]];
	this.reflexiveStitches[[stitch2[localBoardId], stitch2[localBoardStartCoords]]] = [stitch1[localBoardId], stitch1[localBoardStartCoords]];

	validStitches.forEach(stitch => this.addStitch({ stitch }));
};

BoardStitcher.prototype.unstitchBoards = function({ stitch }) {
  const foreignStitchData = this.reflexiveStitches[[stitch[localBoardId], stitch[localBoardStartCoords]]];
  const foreignStitchReference = this.stitchReferenceCompendium.get({ id: foreignStitchData[0] });

  const foreignStitch = foreignStitchReference.getStitchFromCoords({ coords: foreignStitchData[1] });

  this.removeStitch({ stitch });
  this.removeStitch({ foreignStitch });

  delete this.reflexiveStitches[[stitch[localBoardId], stitch[localBoardStartCoords]]];
  delete this.reflexiveStitches[[foreignStitch[localBoardId], foreignStitch[localBoardStartCoords]]];
};

BoardStitcher.prototype.getStitchData = function({ boardId, coords }) {
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
	}

	if (stitch.foreignBoardStartCoords.y === foreignBoard.relativeHeight) {
	  updatedCoords.y -= offset.y
	} else {
	  updatedCoords.y += offset.y
	}

	return {
		stitch,
		updatedCoords,
	}
};

export default BoardStitcher;