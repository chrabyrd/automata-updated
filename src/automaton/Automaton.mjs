import Compendium from '../compendium/compendium.mjs';
import Board from '../board/Board.mjs';
import Entity from '../entity/entity.mjs';
import Clock from '../clock/clock.mjs';


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
  const currentBoard = this.boardCompendium.get({ id: boardStitchingData.boardData.id });
  const boardToBeStitched = this.boardCompendium.get({ id: boardStitchingData.stitchedBoardId });

  const boardStitching = new BoardStitching({ 
    boardData: {
      id: currentBoard.id,
      width: currentBoard.width,
      height: currentBoard.height,
    },
    startCoords: board1StitchingData.startCoords,
    endCoords: board1StitchingData.endCoords, 
    stitchedBoardId: board1StitchingData.stitchedBoardId,
  });

  const boardStitchingReference = this.boardStitchingReferenceCompendium.get({ 
    id: boardStitchingData.boardData.id,
  });

  boardStitchingReference.addStitching({ boardStitching });
};

Automaton.prototype.unstitchBoards = function() {

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

};

Automaton.prototype.updateEntityNeighborhood = function({ entity }) {
  entity.neighborhoodBlueprint.forEach(relativeCoords => {
    this.findRelativeCoordData({
      currentBoardId: entity.locationData.currentBoardId,
      referenceCoords: entity.locationData.referenceCoords,
      relativeCoords,
    })
  })

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