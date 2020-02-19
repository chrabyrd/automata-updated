import Compendium from '../compendium/compendium.mjs';
import BoardController from '../boardController/BoardController.mjs';
import ClockController from '../clockController/ClockController.mjs';
import EntityController from '../entityController/EntityController.mjs';

import { shuffle } from '../tools/shuffle.mjs';

import {
  GET_BOARD_SPACE_INFO,
  CREATE_ENTITY,
  DESTROY_ENTITY,
  PERFORM_ENTITY_SELF_ACTION,
} from '../tools/constants.mjs';


function Automaton () {
  this.boardController = new BoardController();
  this.entityController = new EntityController();

  this.clockController = new ClockController({
    boardCompendium: this.boardController.boardCompendium,
  });

  this.currentClickAction = PERFORM_ENTITY_SELF_ACTION;
  // this.currentClickAction = CREATE_ENTITY;
  // this.currentClickAction = GET_BOARD_SPACE_INFO;


  // document.addEventListener('setCurrentClickAction', e => this.setCurrentClickAction({ e.detail }));

  document.addEventListener('fillBoardWithEntityType', e => this._fillBoardWithEntityType({ ...e.detail }));
  document.addEventListener('boardClick', e => this._handleBoardClick({ boardData: e.detail }));
  document.addEventListener('clockTick', e => this.updateBoardEntities({ boardData: e.detail }));
};

// Automaton.prototype.setCurrentClickAction = function() {
//   if (GET_BOARD_SPACE_INFO) {

//   } else if (CREATE_ENTITY) {

//   } else if (DESTROY_ENTITY) {

//   } else if (PERFORM_ENTITY_SELF_ACTION) {

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

Automaton.prototype.updateBoardEntities = function({ boardData }) {
  const shuffledEntityIds = this._getShuffledEntityIdsFromBoardIds({ boardIds: boardData.boardIds });

  const pendingEntityLocationData = {};

  shuffledEntityIds.forEach(entityId => {
    const result = this.entityController.updateEntity({ 
      entityId, 
      updatedNeighborhoodData: this._getUpdatedEntityNeighborhoods({ entityId, pendingEntityLocationData }),
    });

    if (!result) { return };

    const { boardId, coords, canvas } = result;

    if (!pendingEntityLocationData[boardId]) {
      pendingEntityLocationData[boardId] = {};
    };

    pendingEntityLocationData[boardId][[coords.x, coords.y]] = { entityId, canvas };
  });

  this.boardController.updateBoards({
    pendingLocationData: pendingEntityLocationData,
  });
};

Automaton.prototype._getShuffledEntityIdsFromBoardIds = function({ boardIds }) {
  return shuffle({
    array: boardIds.reduce((acc, boardId) => {
      const board = this.boardController.getBoard({ boardId });
      return acc.concat(board.listEntities());
    }, [])
  });
};

Automaton.prototype._handleBoardClick = function({ boardData }) {
  // if (this.currentClickAction === GET_BOARD_SPACE_INFO) {
  //   return this._getBoardSpaceInfo({ ...clickData });
  // if (this.currentClickAction === CREATE_ENTITY) {
    // return this._createEntity({ ...boardData });
  // } else if (this.currentClickAction === DESTROY_ENTITY) {
  //   return this._destroyEntity({ ...clickData });
  // } else if (this.currentClickAction === PERFORM_ENTITY_SELF_ACTION) {
    return this._performEntitySelfAction({ ...boardData });
  // };
};

Automaton.prototype._getBoardSpaceInfo = function({ absoluteCoordData }) {
  return this.boardController.getBoardDataFromAbsoluteCoordData({ absoluteCoordData });
};

Automaton.prototype._fillBoardWithEntityType = function({ boardId, entityTypeName, entitySize }) {
  const board = this.boardController.getBoard({ boardId });

  this.entityController.setCurrentEntityCreationTypeName({ entityTypeName });

  const relativeEntitySize = entitySize / board.minUnitSize;

  const pendingBoardUpdates = [];

  for (let x = 0; x < board.relativeWidth; x += relativeEntitySize) {
    for (let y = 0; y < board.relativeHeight; y += relativeEntitySize) {
      const coords = { x, y };
      const entity = this.entityController.createEntity({ boardId, coords });

      pendingBoardUpdates.push({
        coords,
        canvas: entity.canvas,
        entityId: entity.id,
      })

    };
  };

  this.boardController.updateBoard({
    boardId,
    updates: pendingBoardUpdates,
  });
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

Automaton.prototype._destroyEntity = function({ boardId, coords }) {

};

Automaton.prototype._performEntitySelfAction = function({ boardId, coords }) {
  const boardData = this.boardController.getBoardDataFromAbsoluteCoordData({ boardId, coords });

  if (!boardData.occupiedSpaceEntityId) { return null };

  const result = this.entityController.performEntityClickAction({ entityId: boardData.occupiedSpaceEntityId });

  this.boardController.updateBoard({
    boardId,
    updates: [{
      coords: result.coords,
      canvas: result.canvas,
      entityId: boardData.occupiedSpaceEntityId,
    }]
  });
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
        referenceCoords: {
          x: locationData.coords.x,
          y: locationData.coords.y,
          z: 0,
        },
        relativeCoords,
      });

      let returnEntity;

      if (
        pendingEntityLocationData[boardId] 
        && pendingEntityLocationData[boardId][coords]
      ) {
        acc[relativeCoords] = pendingEntityLocationData[boardId][coords];
      } else {
        acc[[relativeCoords.x, relativeCoords.y, relativeCoords.z]] = this.boardController.getBoardDataFromAbsoluteCoordData({ boardId, coords });
      };

      return acc;
    }, {})
  ));

  return {
    actionableNeighborhoodData: neighborhoodData[0],
    unactionableNeighborhoodData: neighborhoodData[1],
  };
};

export default Automaton;