import Compendium from '../compendium/compendium.mjs';
import BoardController from '../boardController/BoardController.mjs';
import ClockController from '../clockController/ClockController.mjs';
import EntityController from '../entityController/EntityController.mjs';

import {
  GET_BOARD_SPACE_INFO,
  CREATE_ENTITY,
  DESTROY_ENTITY,
  PERFORM_ENTITY_ACTION,
} from '../tools/constants.mjs';


function Automaton () {
  this.boardController = new BoardController();
  this.entityController = new EntityController();

  this.clockController = new ClockController({
    boardCompendium: this.boardController.boardCompendium,
  });

  this.currentClickAction = CREATE_ENTITY;
  // this.currentClickAction = GET_BOARD_SPACE_INFO;

  // document.addEventListener('fillBoardWithEntityType', e => this._fillBoardWithEntityType({ e.detail }));

  // document.addEventListener('setCurrentClickAction', e => this.setCurrentClickAction({ e.detail }));

  document.addEventListener('boardClick', e => this._handleBoardClick({ boardData: e.detail }))
};

// Automaton.prototype.setCurrentClickAction = function() {
//   if (GET_BOARD_SPACE_INFO) {

//   } else if (CREATE_ENTITY) {

//   } else if (DESTROY_ENTITY) {

//   } else if (PERFORM_ENTITY_ACTION) {

//   }
// };



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

Automaton.prototype.updateBoardEntities = function({ boardIds }) {
  const shuffledEntityIds = this._getShuffledEntityIdsFromBoardIds({ boardIds });

  const pendingEntityLocationData = {};

  const updates = shuffledEntityIds.map(entityId => {
    const result = this.entityController.updateEntity({ 
      entityId, 
      updatedNeighborhoodData: this._getUpdatedEntityNeighborhoods({ entityId, pendingEntityLocationData }),
    });

    const { boardId, coords, canvas } = result;

    if (!pendingEntityLocationData[boardId]) {
      pendingEntityLocationData[boardId] = {};
    };

    pendingEntityLocationData[boardId][coords] = { entityId, canvas };
  });

  this.boardController.updateBoards({
    pendingLocationData: pendingEntityLocationData,
  });
};

Automaton.prototype._getShuffledEntityIdsFromBoardIds = function({ boardIds }) {
  return shuffle({
    array: boardsIds.reduce((acc, boardId) => {
      const board = this.boardController.get({ boardId });
      return acc.concat(board.listEntities());
    }, [])
  });
};

Automaton.prototype._handleBoardClick = function({ boardData }) {
  // if (this.currentClickAction === GET_BOARD_SPACE_INFO) {
  //   return this._getBoardSpaceInfo({ ...clickData });
  // if (this.currentClickAction === CREATE_ENTITY) {
    return this._createEntity({ ...boardData });
  // } else if (this.currentClickAction === DESTROY_ENTITY) {
  //   return this._destroyEntity({ ...clickData });
  // } else if (this.currentClickAction === PERFORM_ENTITY_ACTION) {
  //   return this._performEntityAction({ ...clickData });
  // };
};

Automaton.prototype._getBoardSpaceInfo = function({ absoluteCoordData }) {
  return this.boardController.getBoardDataFromAbsoluteCoordData({ absoluteCoordData });
};

Automaton.prototype._fillBoardWithEntityType = function({ boardId, entityType }) {

};

Automaton.prototype._clearBoard = function({ boardId }) {

};

Automaton.prototype._createEntity = function({ boardId, coords }) {
  const entity = this.entityController.createEntity({ boardId, coords });

  this.boardController.updateBoard({
    boardId,
    updates: [{
      coords,
      canvas: entity.canvas,
      entityId: entity.id,
    }]
  });
};

Automaton.prototype._destroyEntity = function({ boardData }) {
};

Automaton.prototype._performEntityAction = function({ boardData }) {
};

Automaton.prototype._getUpdatedEntityNeighborhoods = function({ entityId, pendingEntityLocationData }) {
  const locationData = this.entityController.getLocationData({ entityId });
  const neighborhoodBlueprints = this.entityController.getNeighborhoodBlueprints({ entityId });

  const neighborhoodData = [
    neighborhoodBlueprints.actionableNeighborhood,
    neighborhoodBlueprints.unactionableNeighborhood,
  ].map(neighborhoodBlueprint => (
    neighborhoodBlueprint.reduce((acc, relativeCoords) => {

      const { boardId, coords } = this.boardController.getAbsoluteCoordDataFromRelative({
        referenceBoardId: locationData.boardId,
        referenceCoords: locationData.coords,
        relativeCoords,
      });

      let returnEntity;

      const pendingEntity = pendingEntityLocationData[boardId][coords];
      if (pendingEntity) {
        return acc[relativeCoords] = pendingEntity;
      } else {
        return acc[relativeCoords] = this.boardController.getBoardDataFromAbsoluteCoordData({ boardId, coords });
      };
    }, {})
  ));

  return {
    actionableNeighborhoodData: neighborhoodData[0],
    unactionableNeighborhoodData: neighborhoodData[1],
  };
};

export default Automaton;