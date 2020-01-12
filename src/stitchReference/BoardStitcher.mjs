import StitchReference from './StitchReference.mjs';

function BoardStitcher({ boardCompendium }) {
	this.boardCompendium = boardCompendium;
};

BoardStitcher.prototype.stitchBoards = function({ board1StitchingData, board2StitchingData }) {
  const board1 = this.boardCompendium.get({ id: board1StitchingData.boardData.id });
  const board2 = this.boardCompendium.get({ id: board2StitchingData.boardData.id });



  THESE VALUES MUST NOT HAVE MIRRORING LOCAL AND FOREIGN BOARD COORDS, NEED TO OFFSET BY 1

  const board1NewStitch = board1.stitchReference.createStitchFromData({
    localBoardId: board1.id,
    localBoardStartCoords: board1StitchingData.startCoords, 
    localBoardEndCoords: board1StitchingData.endCoords, 
    foreignBoardId: board2.id,
    foreignBoardStartCoords: board2StitchingData.startCoords,
    foreignBoardEndCoords: board2StitchingData.endCoords,
  });

  const board2NewStitch = board2.stitchReference.createStitchFromData({
    localBoardId: board2.id,
    localBoardStartCoords: board2StitchingData.startCoords, 
    localBoardEndCoords: board2StitchingData.endCoords, 
    foreignBoardId: board1.id,
    foreignBoardStartCoords: board1StitchingData.startCoords,
    foreignBoardEndCoords: board1StitchingData.endCoords,
  });

  [{ board: board1, stitch: board1NewStitch }, { board: board2, stitch: board2NewStitch }].forEach(data => {
    const { board, stitch } = data;

    if (!board.stitchReference.areStitchDimensionsEqual({ stitch })) {
      throw new Error('need equal dimensions');
    };

    const conflictingStitches = board.stitchReference.getConflictingStitches({ stitch });

    if (conflictingStitches.length) {
     throw new Error(conflictingStitches) 
   };
  });

  // should only reach here if everything is valid && clear
  board1.stitchReference.addStitch({ stitch: board1NewStitch });
  board2.stitchReference.addStitch({ stitch: board2NewStitch });
};

BoardStitcher.prototype.unstitchBoards = function({ stitch }) {
  const localBoard = this.boardCompendium.get({ id: stitch.localBoardId });
  const foreignBoard = this.boardCompendium.get({ id: stitch.foreignBoardId });

  const foreignStitch = foreignBoard.stitchReference.getStitchFromCoords({ ...stitch.foreignBoard.startCoords });

  localBoard.stitchReference.removeStitchFromReference({ stitch });
  foreignBoard.stitchReference.removeStitchFromReference({ foreignStitch });
};



// const updatedCoords = { ...stitch.foreignBoardStartCoords };

// if (stitch.foreignBoardStartCoords.x === board.relativeWidth) {
//   updatedCoords.x -= offset.x
// } else {
//   updatedCoords.x += offset.x
// }

// if (stitch.foreignBoardStartCoords.y === board.relativeHeight) {
//   updatedCoords.y -= offset.y
// } else {
//   updatedCoords.y += offset.y
// }

// boardData = board.analyzeCoords(updatedCoords);



// Board.prototype.calculateForeignCoordData = function({ x, y, z }) {
// 	const stitch = this.stitchReference.getStitchFromCoords({ ...coords });

// 	if (!stitch) { return {} };

// 	const offset = { 
// 		x: x - stitch.localBoardStartCoords.x,
// 		y: y - stitch.localBoardStartCoords.y,
// 		z: z - stitch.localBoardStartCoords.z,
// 	};

// 	return {
// 		stitch,
// 		offset,
// 	};
// };

export default BoardStitcher;