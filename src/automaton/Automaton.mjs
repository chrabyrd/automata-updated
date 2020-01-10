import Compendium from '../compendium/compendium.mjs';
import Board from '../board/Board.mjs';
import Entity from '../entity/entity.mjs';
import Clock from '../clock/clock.mjs';

import BoardCoordData from '../stitchReference/StitchReferenceTools.mjs'


function Automaton ({ minUnitSize }) {
	this.id = Symbol();
  this.minUnitSize = minUnitSize;

  this.boardCompendium = new Compendium();
};

Automaton.prototype.shuffle = function({ array }) {
  // Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // destructured assignment causes performance loss
    // so let's get descriptive
    let tempVar = array[i];
    array[i] = array[j];
    array[j] = tempVar;
  }

  return array;
}

Automaton.prototype.createBoard = function({ width, height }) {
  const board = new Board({
    width,
    height,
    minUnitSize: this.minUnitSize,
  });

  this.boardCompendium.add({ entry: board });
};

Automaton.prototype.deleteBoard = function({ boardId }) {
  this.boardCompendium.remove({ id: boardId });
};

Automaton.prototype.stitchBoards = function({ board1StitchingData, board2StitchingData }) {
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

Automaton.prototype.unstitchBoards = function({ stitch }) {
  const localBoard = this.boardCompendium.get({ id: stitch.localBoardId });
  const foreignBoard = this.boardCompendium.get({ id: stitch.foreignBoardId });

  const foreignStitch = foreignBoard.stitchReference.getStitchFromCoords({ ...stitch.foreignBoard.startCoords });

  localBoard.stitchReference.removeStitchFromReference({ stitch });
  foreignBoard.stitchReference.removeStitchFromReference({ foreignStitch });
};

// Automaton.prototype.createEntity = function({ entityData }) {
//   const entity = new Entity({ ...entityData });

//   this.entityCompendium.add({ entry: entity });

//   const { coords, canvas, size } = entity;

//   this.grid.update({ 
//     imageStream: [{ coords, canvas, size }],
//   });
// };

// Automaton.prototype.deleteEntity = function({ entityId }) {
//   this.entityCompendium.remove({ id: entityId });

//   this.grid.update({ 
//     imageData: {
//       coords,
//       size: entity.size,
//       color: null,
//     },
//   });
// };

Automaton.prototype.findRelativeCoordData = function({ currentBoardId, referenceCoords, relativeCoords }) {
  let coordInfo = new BoardCoordData({
    isSpaceAvailable: false,
    isSpaceValid: false,
    entity: null,
    foreignCoordData: {},
  });

  do {
    let board;
    let boardData;

    if (Object.keys(coordInfo.foreignCoordData).length === 0) {
      board = this.boardCompendium.get({ id: currentBoardId });

      boardData = board.analyzeCoords({
        x: referenceCoords.x + relativeCoords.x,
        y: referenceCoords.y + relativeCoords.y,
        z: referenceCoords.z + relativeCoords.z,
      });
    } else {
      const { stitch, offset } = coordInfo.foreignCoordData;

      board = this.boardCompendium.get({ id: stitch.foreignBoardId });

      const updatedCoords = { ...stitch.foreignBoardStartCoords };

      if (stitch.foreignBoardStartCoords.x === board.relativeWidth) {
        updatedCoords.x -= offset.x
      } else {
        updatedCoords.x += offset.x
      }

      if (stitch.foreignBoardStartCoords.y === board.relativeHeight) {
        updatedCoords.y -= offset.y
      } else {
        updatedCoords.y += offset.y
      }

      boardData = board.analyzeCoords(updatedCoords);
    };

    coordInfo = new BoardCoordData({ ...boardData });

  } while (
    coordInfo.entity === null
    && coordInfo.isSpaceValid === false
  );


  if (coordInfo.entity) {
    return coordInfo.entity
  } else if (coordInfo.isSpaceValid) {
    return EMPTY_SPACE
  }

  return null
};

Automaton.prototype.updateEntityNeighborhood = function({ entity }) {
  entity.neighborhoodBlueprint.forEach(relativeCoords => {
    const coordData = this.findRelativeCoordData({
      currentBoardId: entity.locationData.currentBoardId,
      referenceCoords: entity.locationData.referenceCoords,
      relativeCoords,
    });

  });
};

Automaton.prototype.updateBoards = function({ boardIds }) {
  const shuffledEntities = this.shuffle({
    array: boardIds.reduce(( accumulator, boardId ) => {
      const board = boardCompendium.get({ id: boardId });
      return accumulator.concat(board.entityCompendium.list());
    }, []),
  });

  shuffledEntities.forEach(entity => {
    this.updateEntityNeighborhood({ entity });
  });

};


// Automaton.prototype.handleClickEvent = function(e) {
// 	const coords = this.grid.mouseCoords;

// };

export default Automaton;