import Compendium from '../compendium/compendium.mjs';
import Board from '../board/Board.mjs';
import BoardStitcher from '../boardStitcher/BoardStitcher.mjs'
import Entity from '../entity/Entity.mjs';

import { shuffle } from '../tools/shuffle.mjs';


function Automaton ({ minUnitSize }) {
	this.id = Symbol();
  this.minUnitSize = minUnitSize;

  this.boardCompendium = new Compendium();

  this.boardStitcher = new boardStitcher({ boardCompendium: this.boardCompendium });
  this.entityController = new EntityController({ boardCompendium: this.boardCompendium });
};

Automaton.prototype.createBoard = function({ width, height }) {
  const board = new Board({
    width,
    height,
    minUnitSize: this.minUnitSize,
  });

  this.boardCompendium.add({ entry: board });
};

Automaton.prototype.destroyBoard = function({ boardId }) {
  this.boardCompendium.remove({ id: boardId });
};

Automaton.prototype.updateBoards = function({ boardIds }) {
  const boards = boardIds.map(boardId => this.boardCompendium.get({ id: boardId }));

  boards.forEach(board => board.incrementTickCount());

  const shuffledEntities = shuffle({
    array: boards.reduce((acc, board) => (
      acc.concat(board.entityCompendium.list());
    ), []),
  });

  shuffledEntities.forEach(entity => this.updateEntity({ entity }));

  this.boardCompendium.list().forEach(board => board.updateGrid());
};

Automaton.prototype.stitchBoards = function({ board1StitchData, board2StitchData }) {
  this.boardStitcher.stitchBoards({ board1StitchData, board2StitchData });
};

Automaton.prototype.unstitchBoards = function({ stitch }) {
  this.boardStitcher.unstitchBoards({ stitch });
};

Automaton.prototype.createEntity = function({ entityData }) {
  //  only to be used to handle user input ???
  const entity = new Entity({ ...entityData });
  const board = this.boardCompendium.get({ id: entity.locationData.boardId });

  board.addEntity({ entity });
};

Automaton.prototype.destroyEntity = function({ entity }) {
  //  only to be used to handle user input ???
  const board = this.boardCompendium.get({ id: entity.locationData.boardId });

  board.removeEntity({ entity });
  entity.selfDestruct();
};

Automaton.prototype.updateEntity = function({ entity }) {
  const neighborhoodBlueprints = entity.getNeighborhoodBlueprints();

  const neighborhood = neighborhoodBlueprints.reduce((acc, relativeCoords) => {
    acc[relativeCoords] = this.findRelativeCoordData({
      currentBoardId: entity.locationData.currentBoardId,
      referenceCoords: entity.locationData.referenceCoords,
      relativeCoords,
    });
  }, {});

  entity.updateNeighborhood({ entity, neighborhood });

  const { originalLocationData, originalImageData } = entity;

  // entity outputs external actions?
  entity.performAction();

  const { newLocationData, newImageData } = entity;

  if (!newLocationData) {
    const board = this.boardCompendium.get(originalLocationData.boardId);
    board.removeEntity({ entity });
  } else if (originalLocationData.boardId !== newLocationData.boardId) {
    const originalBoard = this.boardCompendium.get(originalLocationData.boardId);
    const newBoard = this.boardCompendium.get(newLocationData.boardId);

    originalBoard.removeEntity({ entity });
    originalBoard.addEntity({ entity });
  } else if (
    originalLocationData.coords !== newLocationData.coords
    || originalImageData !== newImageData
  ) {
    const board = this.boardCompendium.get(originalLocationData.boardId);
    board.updateEntityReference({ 
      previousLocationData: originalLocationData, 
      entity,
    });
  };
};

Automaton.prototype.findRelativeCoordData = function({ currentBoardId, referenceCoords, relativeCoords }) {
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
      const { stitch, updatedCoords } = this.boardStitcher.getStitchData({
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

export default Automaton;