import Entity from '../entity/Entity.mjs';
import Compendium from '../compendium/Compendium.mjs';

import { UPDATE_SELF } from '../tools/constants.mjs';


function EntityController() {
	this.entityTypes = {};
	this.entityCompendium = new Compendium();

	this.currentEntityCreationTypeName = null;

	document.addEventListener('createEntityType', e => this._createEntityType({ entityTypeData: e.detail }));
	document.addEventListener('destroyEntityType', e => this._destroyEntityType({ entityTypeName: e.detail }));
	document.addEventListener('setCurrentEntityCreationTypeName', e => this._setCurrentEntityCreationTypeName({ entityTypeData: e.detail }));
	document.addEventListener('unsetCurrentEntityCreationTypeName', e => this._unsetCurrentEntityCreationTypeName({ entityTypeName: e.detail }));
};

EntityController.prototype.createEntity = function({ boardId, coords }) {
	const entityType = this.entityTypes[this.currentEntityCreationTypeName];


	const entity = new entityType();

	entity.updateLocationData({
		locationData: { boardId, coords },
	});

	this.entityCompendium.add({ entry: entity });

	return entity;
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


EntityController.prototype.updateEntity = function({ entityId, updatedNeighborhoodData }) {
 	const entity = this.entityCompendium.get({ id: entityId });

 	console.log('entity_update', updatedNeighborhoodData )

	this._updateEntityNeighborhoods({ entityId, ...updatedNeighborhoodData });

	const requestedUpdate = entity.requestUpdate();

	let result;

 	// switch (actionType) {
 		// case UPDATE_SELF:
 			result = this._performUpdateSelfEntityAction({ entity, action: requestedUpdate.action });
 			// break;
 		// case UPDATE_TARGET_ENTITY:
 		// 	result = this._performUpdateTargetEntityEntityAction({ entity, action, target });
 		// 	break;
 		// case MOVE_SELF_TO_TARGET:
 		// 	result = this._performMoveSelfToTargetEntityAction({ entity, action, target });
 		// 	break;
 		// case CREATE_ENTITY_AT_TARGET:
 		// default: 
 			// return null;
 	// };

 	return result;
};

EntityController.prototype._performUpdateSelfEntityAction = function({ entity, action }) {
	const originalImageDescriptors = entity.imageData.imageDescriptors;

	// console.log(entity, action)
	action();
	// action.call(entity);
	entity.incrementTickCount();

	if (entity.imageData.imageDescriptors !== originalImageDescriptors) {
		return {
			canvas: entity.canvas,
			...entity.locationData
		};
	};

	return null;
};

// EntityController.prototype._performUpdateTargetEntityEntityAction = function({ entity, action, target }) {
// 	const targetEntity = this.entityCompendium.get({ id: target.entityId });
// 	if (!targetEntity) return null;

// 		const originalImageDescriptors = entity.imageDescriptors;
// 	const originalTargetEntityImageDescriptors = targetEntity.imageDescriptors;

// 	const { entityReaction, targetReaction } = entity.action({ target: targetEntity });

// 	const entityResult = entity.entityReaction();
// 	const targetResult = targetEntity.targetReaction();

// 	const returnData = [];

// 	if (entity.imageDescriptors !== originalImageDescriptors) {
// 		returnData.push(entity.locationData);
// 	};

// 	if (targetEntity.imageDescriptors !== originalTargetEntityImageDescriptors) {
// 		returnData.push(targetEntity.locationData);
// 	};

// 	return returnData;
// };

// EntityController.prototype._performMoveSelfToTargetEntityAction = function({ entity, action, target }) {
// 	const targetEntity = this.entityCompendium.get({ id: target.entityId });
// 	if (targetEntity) return null;

// 	const originalImageDescriptors = entity.imageDescriptors;
// 	const originalLocationData = entity.locationData;

// 	entity.action();

// 	const returnData = [];

// 	if (entity.loactionData !== originalLocationData) {
// 		returnData.push(entity.locationData);
// 		returnData.push(originalLocationData);
// 	}

// 	if (entity.imageDescriptors !== originalImageDescriptors) {
// 		returnData.push(entity.locationData);
// 	};

// 	return returnData;
// };
 	
// EntityController.prototype._performCreateEntityAtTargetEntityAction = function() {
// 	const targetEntity = this.entityCompendium.get({ id: target.entityId });
// 	if (targetEntity) return null;

// 	const { entityReaction, targetReaction } = entity.action({ target: target });


// };

EntityController.prototype._createEntityType= function({ entityTypeData }) {
	const typeName = entityTypeData.typeName;

	this.entityTypes[typeName] = function() {
		Entity.call(this, entityTypeData);
	};

	this.entityTypes[typeName].prototype = Object.create(Entity.prototype);
	this.entityTypes[typeName].prototype.constructor = this.entityTypes[typeName];
};

EntityController.prototype._destroyEntityType = function({ entityTypeName }) {
	delete this.entityTypes[entityTypeName];
};

EntityController.prototype._setCurrentEntityCreationTypeName = function({ entityTypeData }) {
	this.currentEntityCreationTypeName = entityTypeData.typeName;
};

EntityController.prototype._unsetCurrentEntityCreationTypeName = function({ entityTypeName }) {
	this.currentEntityCreationTypeName = null;
};

EntityController.prototype._updateEntityNeighborhoods = function({ entityId, actionableNeighborhoodData, unactionableNeighborhoodData }) {
 	const entity = this.entityCompendium.get({ id: entityId });

 	console.log('foo', actionableNeighborhoodData, unactionableNeighborhoodData)

 	const neighborhoods = [
 		actionableNeighborhoodData, 
 		unactionableNeighborhoodData,
 	].map(neighborhoodData => (
 		this._getEntityNeighborhoodFromNeighboorhoodData({ neighborhoodData })
 	));

	entity.updateNeighborhoods({ 
		actionableNeighborhood: neighborhoods[0], 
		unactionableNeighborhood: neighborhoods[1],
	});
};

EntityController.prototype._getEntityNeighborhoodFromNeighboorhoodData = function({ neighborhoodData }) {
	const neighborhood = {};

	Object.keys(neighborhoodData).forEach(relativeCoord => {
		const { isValidSpace, occupiedSpaceEntityId } = neighborhoodData[relativeCoord];

 		let imageDescriptors = [];

 		if (isValidSpace && occupiedSpaceEntityId) {
	 		const entity = this.entityCompendium.get({ id: occupiedSpaceEntityId });
	 		imageDescriptors = entity.imageData.imageDescriptors;
 		};

 		neighborhood[relativeCoord] = {
 			isValidSpace,
 			isOccupiedSpace: Boolean(occupiedSpaceEntityId),
 			imageDescriptors,
 			entityId: occupiedSpaceEntityId ? occupiedSpaceEntityId : null,
 		};
 	});

 	return neighborhood;
};

export default EntityController;