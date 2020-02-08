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

  this.currentClickAction = null;


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

Automaton.prototype.setCurrentClickAction = function() {

};

Automaton.prototype.getEntityIdsFromBoardIds = function({ boardIds }) {
  return shuffle({
    array: boardsIds.reduce((acc, boardId) => {
      const board = this.boardController.get({ boardId });
      return acc.concat(board.listEntities());
    }, [])
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
    
//   };

//   this.entityController.createEntity({ entityData });
// };

Automaton.prototype.updateBoards = function({ boardIds }) {
  const entityIds = this.getEntityIdsFromBoardIds({ boardIds });
  entityIds.map(entityId => this._updateEntity({ entityId }));
};

Automaton.prototype._getBoardSpaceInfo = function({ absoluteCoordData }) {
  return this.boardController.getBoardDataFromAbsoluteCoordData({ absoluteCoordData });
};

Automaton.prototype._fillBoardWithEntityType = function({ boardId, entityType }) {

};

Automaton.prototype._clearBoard = function({ boardId }) {

};

Automaton.prototype._createEntity = function({ boardData, entityData }) {
};

Automaton.prototype._destroyEntity = function({ boardData }) {
};

Automaton.prototype._performEntityAction = function({ boardData }) {
};

Automaton.prototype._updateEntity = function({ entityId }) {
  const locationData = this.entityController.getLocationData({ entityId });
  const neighborhoodBlueprints = this.entityController.getNeighborhoodBlueprints({ entityId });

  const neighborhoods = [
    neighborhoodBlueprints.actionableNeighborhood,
    neighborhoodBlueprints.unactionableNeighborhood,
  ].map(neighborhoodBlueprint => (
    neighborhoodBlueprint.reduce((acc, relativeCoords) => (
      acc[relativeCoords] = this.boardController.getBoardDataFromRelativeCoordData({
        relativeCoordData: {
          referenceBoardId: locationData.boardId,
          referenceCoords: locationData.corods,
          relativeCoords,
        },
      })
    ), {})
  ));

  this.entityController.updateEntityNeighborhood({ 
    entityId, 
    actionableNeighborhood: neighborhoods[0],
    unactionableNeighborhood: neighborhoods[1],
  });

  return this.entityController.updateEntity({ entityId });
};

export default Automaton;