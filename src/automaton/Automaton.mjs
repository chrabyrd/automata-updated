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

  // document.addEventListener('setCurrentClickAction', e => this.setCurrentClickAction({ e.detail }));

  document.addEventListener('fillBoardWithEntityType', e => this._fillBoardWithEntityType({ ...e.detail }));
  document.addEventListener('boardClick', e => this._handleBoardClick({ ...e.detail }));
  document.addEventListener('clockTick', e => this.updateBoardEntities({ ...e.detail }));
};

// Automaton.prototype.setCurrentClickAction = function() {
//   if (GET_BOARD_SPACE_INFO) {

//   } else if (CREATE_ENTITY) {

//   } else if (DESTROY_ENTITY) {

//   } else if (PERFORM_ENTITY_SELF_ACTION) {

//   }
// };

Automaton.prototype._handleBoardClick = function({ boardId, coords }) {
  // if (this.currentClickAction === GET_BOARD_SPACE_INFO) {
  //   return this._getBoardSpaceInfo({ ...clickData });
  // if (this.currentClickAction === CREATE_ENTITY) {
    // return this._createEntity({ ...boardData });
  // } else if (this.currentClickAction === DESTROY_ENTITY) {
  //   return this._destroyEntity({ ...clickData });
  // } else if (this.currentClickAction === PERFORM_ENTITY_SELF_ACTION) {
    return this._performEntitySelfAction({ boardId, coords });
  // };
};

Automaton.prototype._fillBoardWithEntityType = function({ boardId, entityTypeName, entitySize }) {
  const board = this.boardController.getBoard({ boardId });

  this.entityController.setCurrentEntityCreationTypeName({ entityTypeName });

  const relativeEntitySize = entitySize / board.minUnitSize;

  const pendingUpdates = [];

  for (let x = 0; x < board.relativeWidth; x += relativeEntitySize) {
    for (let y = 0; y < board.relativeHeight; y += relativeEntitySize) {
      const coords = { x, y };

      const entityId = this.entityController.createEntity({ boardId, coords });
      const canvas = this.entityController.getCanvas({ entityId }); 

      pendingUpdates.push({ 
        entityId, 
        coords, 
        canvas,
      });
    };
  };

  this.boardController.updateBoard({
    boardId,
    updates: pendingUpdates,
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

Automaton.prototype.updateBoardEntities = function({ boardIds }) {
  const shuffledEntityIds = this._getShuffledEntityIdsFromBoardIds({ boardIds });

  const proposedEntityUpdates = shuffledEntityIds.map(entityId => {
    return this._getEntityUpdate({ entityId });
  });

  const entityUpdateResults = proposedEntityUpdates.reduce((acc, update) => {
    const result = this.entityController.performUpdate({ ...update });

    if (result) { acc.push(update) };
    return acc;
  }, []);

  const boardUpdates = this._getBoardUpdatesFromEntityUpdateResults({ entityUpdateResults });

  this.boardController.updateBoards({ boardUpdates });
};

Automaton.prototype._getShuffledEntityIdsFromBoardIds = function({ boardIds }) {
  return shuffle({
    array: boardIds.reduce((acc, boardId) => {
      const board = this.boardController.getBoard({ boardId });
      return acc.concat(board.listEntities());
    }, [])
  });
};

Automaton.prototype._getEntityUpdate = function({ entityId }) {
  return this.entityController.requestUpdate({
   entityId, 
   neighborhoodData: this._getNeighborhoodData({ entityId }),
 });
};

Automaton.prototype._getNeighborhoodData = function({ entityId }) {
  const neighborhoodBlueprints = this.entityController.getNeighborhoodBlueprints({ entityId });

  return Object.entries(neighborhoodBlueprints).reduce((acc, [neighborhoodTitle, blueprint]) => {
    acc[neighborhoodTitle] = this._getNeighborhoodDataFromBlueprint({ entityId, blueprint });
    return acc;
  }, {});
};

Automaton.prototype._getNeighborhoodDataFromBlueprint = function({ entityId, blueprint }) {
  const entityLocationData = this.entityController.getLocationData({ entityId });

  return blueprint.reduce((acc, relativeCoords) => {
    const { boardId, coords } = this.boardController.getAbsoluteCoordDataFromRelative({
      referenceBoardId: entityLocationData.boardId,
      referenceCoords: {
        x: entityLocationData.coords.x,
        y: entityLocationData.coords.y,
        z: 0,
      },
      relativeCoords,
    });

    const detailedBoardData = this._getDetailedBoardDataFromAbsoluteCoordData({ boardId, coords });

    acc[[relativeCoords.x, relativeCoords.y, relativeCoords.z]] = detailedBoardData;
    return acc;
  }, {});
};

Automaton.prototype._getDetailedBoardDataFromAbsoluteCoordData = function({ boardId, coords }) {
  const {
    isValidSpace,
    isOccupiedSpace,
    entityId,
  } = this.boardController.getBoardDataFromAbsoluteCoordData({ boardId, coords });

  const imageDescriptors = [];

  if (entityId) {
    const imageData = this.entityController.getImageData({ entityId });

    for (const imageDescriptor of imageData.imageDescriptors){
      imageDescriptors.push(imageDescriptor)
    }
  };

  return {
    isValidSpace,
    isOccupiedSpace,
    entityId,
    imageDescriptors,
  };
};

Automaton.prototype._getBoardUpdatesFromEntityUpdateResults = function({ entityUpdateResults }) {
  return entityUpdateResults.reduce((acc, result) => {
    const entityId = result.entityId;
    const { boardId, coords } = this.entityController.getLocationData({ entityId });

    if (!acc[boardId]) {
      acc[boardId] = [];
    };

    acc[boardId].push({
      entityId,
      coords,
      canvas: this.entityController.getCanvas({ entityId }),
    });

    return acc;
  }, {});
};

Automaton.prototype._performEntitySelfAction = function({ boardId, coords }) {
  const { 
    isValidSpace, 
    isOccupiedSpace, 
    entityId, 
  } = this.boardController.getBoardDataFromAbsoluteCoordData({ boardId, coords });

  if (!isOccupiedSpace) { return null };

  const result = this.entityController.performEntityClickAction({ entityId });

  this.boardController.updateBoard({
    boardId,
    updates: [{
      entityId,
      coords,
      canvas: this.entityController.getCanvas({ entityId }),
    }]
  });
};

export default Automaton;