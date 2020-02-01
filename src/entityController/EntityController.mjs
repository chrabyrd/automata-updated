import Entity from '../entity/Entity.mjs';
import Compendium from '../compendium/Compendium.mjs';


function EntityController() {
	this.entityCompendium = new Compendium()
};

EntityController.prototype.createEntity = function({ entityData }) {
	const entity = new Entity({ ...entityData });
	this.entityCompendium.add({ entry: entity });
};

EntityController.prototype.destroyEntity = function({ entityId }) {
  const entity = this.entityCompendium.get({ id: entityId });
  entity.selfDestruct();

  this.entityCompendium.remove({ id: entityId });
};

EntityController.prototype.getEntityFromId = function({ entityId }) {
  return this.entityCompendium.get({ id: entityId });
};

EntityController.prototype.updateEntity = function({ entity, lookupFunc }) {
	const updatedNeighborhood = entity.neighborhoodBlueprints.reduce((acc, relativeCoords) => {
	  acc[relativeCoords] = lookupFunc({
	    currentBoardId: entity.locationData.currentBoardId,
	    referenceCoords: entity.locationData.referenceCoords,
	    relativeCoords,
	  });
	}, {});

	entity.updateNeighborhood({ entity, updateNeighborhood });

	const { originalLocationData, originalImageData } = entity;

	const actionResult = entity.performAction();

	const { newLocationData, newImageData } = entity;

	return { 
		originalLocationData, 
		originalImageData, 
		newLocationData, 
		newImageData, 
		actionResult,
	};
};

// 	if (!newLocationData) {
// 	  const board = this.boardCompendium.get(originalLocationData.boardId);
// 	  board.removeEntity({ entity });
// 	} else if (originalLocationData.boardId !== newLocationData.boardId) {
// 	  const originalBoard = this.boardCompendium.get(originalLocationData.boardId);
// 	  const newBoard = this.boardCompendium.get(newLocationData.boardId);

// 	  originalBoard.removeEntity({ entity });
// 	  newBoard.addEntity({ entity });
// 	} else if (
// 	  originalLocationData.coords !== newLocationData.coords
// 	  || originalImageData !== newImageData
// 	) {
// 	  const board = this.boardCompendium.get(originalLocationData.boardId);
// 	  board.updateLocationData({ 
// 	    previousLocationData: originalLocationData, 
// 	    entity,
// 	  });
// 	};
// };

export default EntityController;