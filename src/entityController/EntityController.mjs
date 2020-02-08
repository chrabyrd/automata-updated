import Entity from '../entity/Entity.mjs';
import Compendium from '../compendium/Compendium.mjs';


function EntityController() {
	this.entityTypes = {};
	this.entityCompendium = new Compendium();

	this.currentEntityType = null;
};

EntityController.prototype.createEntityType= function({ entityTypeData }) {
	const name = entityTypeData.name;

	this.entityTypes[name] = () => {
		Entity.call(this, ...entityTypeData);
	};

	this.entityTypes[name].prototype = Object.create(Entity.prototype);
	this.entityTypes[name].prototype.constructor = this.entityTypes[name];
};

EntityController.prototype.destroyEntityType = function({ entityTypeName }) {
	delete this.entityTypes[entityTypeName];
};

// EntityController.prototype.setCurrentEntityType = function({ entityTypeName }) {
// 	this.currentEntityType = this.entityTypes[entityTypeName];
// };

// EntityController.prototype.unsetCurrentEntityType = function({ entityTypeName }) {
// 	this.currentEntityType = null;
// };

EntityController.prototype.createEntity = function({ entityData }) {
	const entity = new Entity({ ...entityData });
	this.entityCompendium.add({ entry: entity });
};

EntityController.prototype.destroyEntity = function({ entityId }) {
  const entity = this.entityCompendium.get({ id: entityId });
  entity.selfDestruct();

  this.entityCompendium.remove({ id: entityId });
};

EntityController.prototype.getLocationData = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.locationData;
};

EntityController.prototype.getNeighborhoodBlueprints = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.neighborhoodBlueprints;
};

EntityController.prototype.updateEntityNeighborhood = function({ entityId, actionableNeighborhood, unactionableNeighborhood }) {
 	const entity = this.entityCompendium.get({ id: entityId });
	entity.updateNeighborhoods({ actionableNeighborhood, unactionableNeighborhood });
};

EntityController.prototype.updateEntity = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });

	const requestedUpdate = entity.requestUpdate();

	// return this._analyzeEntityUpdate({ 
	// 	originalLocationData, 
	// 	originaImageDescriptors, 
	// 	externalActionResult,
	// 	entity,
	// });
};

// EntityController.prototype._analyzeEntityUpdate = function({ originalLocationData, originaImageDescriptors, externalActionResults, entity }) {
// 	// if the entity didn't change in a way that affects the boards
// 	// if (
// 	// 	originalLocationData === entity.locationData
// 	// 	&& originaImageDescriptors === entity.imageDescriptors
// 	// 	&& externalActionResult === null
// 	// ) { return };

// 	const returnData = [];

// 	// if the entity moved or selfDestructed, clear board location
// 	if (
// 		!entity.locationData
// 		|| entity.locationData !== originalLocationData
// 	) {
// 		returnData.push([ originalLocationData, null ]);
// 	};

// 	// if the entity moved or reproduced, add new board location
// 	if (
// 		entity.locationData !== originalLocationData

// 	)


// };

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