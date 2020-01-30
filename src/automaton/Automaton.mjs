import Compendium from '../compendium/compendium.mjs';
import BoardController from '../boardController/BoardController.mjs';
import ClockController from '../clockController/ClockController.mjs';
import EntityController from '../entityController/EntityController.mjs';


function Automaton () {
  this.boardController = new BoardController();
  this.entityController = new EntityController();

  this.clockController = new ClockController({
    boardCompendium: this.boardController.boardCompendium,
  });




  this.boardEntityDataCompendium = new Compendium();

  // const eventListeners = [
  //   ['createBoard', e => this.createBoard(e.detail)],
  //   ['destroyBoard', e => this.destroyBoard(e.detail)],

  //   ['stitchBoards', e => this.stitchBoards(e.detail)],
  //   ['unstitchBoards', e => this.unstitchBoards(e.detail)],

  //   ['boardClick', e => this.boardClick(e.detail)],


  //   // CREATE CLOCK NEEDS BOARD CALLBACK
  //   ['createClock', e => this.createClock(e.detail)],
  //   ['destroyClock', e => this.destroyClock(e.detail)],



  //   // MOVE TICK LISTENER TO CLOCK OR CONTROLLER
  //   ['clockTick', e => this.clockTick(e.detail)],

  //   ['setClockTickInterval', e => this.setClockTickInterval(e.detail)],
  //   ['clearClockTickInterval', e => this.clearClockTickInterval(e.detail)],
  // ];

  // eventListeners.forEach(eventListener => {
  //   document.addEventListener(eventListener[0], eventListener[1]);
  // });
};

Automaton.prototype.getEntityIdsFromBoardIds = function({ boardIds }) {
  return shuffle({
    array: boardsIds.reduce((acc, boardId) => {
      const boardEntityData = this.boardEntityDataCompendium.get({ id: boardId });
      acc.concat(boardEntityData.entityIds)
    }, []);
  });
};





// Automaton.prototype.createBoard = function({ boardData }) {
//   const board = this.boardController.createBoard({ ...boardData });

//   this.boardEntityDataCompendium.add({ 
//     entry: {
//       id: board.id,
//       entityIds: []
//     }
//   });
// };

// Automaton.prototype.destroyBoard = function({ boardId }) {
//   this.boardController.destroyBoard({ boardId });
//   this.boardEntityDataCompendium.remove({ id: boardId });
// };

// Automaton.prototype.boardClick = function({ clickData }) {
//   const entityData = {
//     size: 25,
//     locationData: {
//       boardId: clickData.boardId,
//       coords: clickData.coords,
//     },
//     imageData: {
//       color: 'orange',
//       descriptors: ['on'],
//     },
//     neighborhoodBlueprint: {
//       actionableNeighborhood: [
//         { x: -1, y: -1, z: 0, },
//         { x: 0, y: -1, z: 0, },
//         { x: 1, y: -1, z: 0, },
//         { x: 1, y: 0, z: 0, },
//         { x: 1, y: 1, z: 0, },
//         { x: 0, y: 1, z: 0, },
//         { x: -1, y: 1, z: 0, },
//         { x: -1, y: 0, z: 0, },
//       ],
//       unactionableNeighborhood: [],
//     },
//   };

//   this.entityController.createEntity({ entityData });
// };

// Automaton.prototype.stitchBoards = function({ stitchData }) {
//   this.boardController.stitchBoards({ ...stitchData });
// };

// Automaton.prototype.unstitchBoards = function({ stitch }) {
//   this.boardController.unstitchBoards({ stitch });
// };

// Automaton.prototype.createClock = function({ clockhData }) {
//   this.clockController.createClock({ ...clockhData });
// };

// Automaton.prototype.destroyClock = function({ clockId }) {
//   this.clockController.destroyClock({ clockId });
// };

// Automaton.prototype.clockTick = function({ clockId }) {
//   this.clockController.clockTick({ clockId });
// };

// Automaton.prototype.setClockTickInterval = function({ clockId, tickInterval }) {
//   this.clockController.setClockTickInterval({ clockId, tickInterval });
// };

// Automaton.prototype.clearClockTickInterval = function({ clockId }) {
//   this.clockController.clearClockTickInterval({ clockId, tickInterval });
// };

Automaton.prototype.foo = function({ boardIds }) {
  const entityIds = this.getEntityIdsFromBoardIds({ boardIds });

  const entities = entityIds.map(entityId => (
    this.entityController.getEntityFromId({ entityId });
  ));

  entities.forEach(entity => {
    const updatedNeighborhood = entity.neighborhoodBlueprints.reduce((acc, relativeCoords) => {
      acc[relativeCoords] = this.boardController.findRelativeCoordData({
        currentBoardId: entity.locationData.currentBoardId,
        referenceCoords: entity.locationData.referenceCoords,
        relativeCoords,
      });
    }, {});

    const entityUpdateResult = this.entityController.updateEntity({ entity, updatedNeighborhood });

    this.analyzeEntityUpdateResult({ entity, entityUpdateResult });
  });
};

Automaton.prototype.analyzeEntityUpdateResult = function({ entity, entityUpdateResult }) {
  const { 
    originalLocationData, 
    originalImageData, 
    newLocationData, 
    newImageData, 
    actionResult 
  } = entityUpdateResult;

  if (!newLocationData) { 
    this.entityController.destroyEntity({ entity });
  } else if (originalLocationData.boardId !== newLocationData.boardId) {
    this.entityController.
  }


};

export default Automaton;