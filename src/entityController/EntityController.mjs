import Entity from '../entity/Entity.mjs';
import Compendium from '../compendium/Compendium.mjs';

import { UPDATE_SELF } from '../tools/constants.mjs';


function EntityController() {
	this.entityCompendium = new Compendium();

	this.entityTypes = {};

	document.addEventListener('createEntityType', e => this._createEntityType({ entityTypeData: e.detail }));
	document.addEventListener('destroyEntityType', e => this._destroyEntityType({ entityTypeName: e.detail }));

	this.currentEntityCreationTypeName = null;

	document.addEventListener('setCurrentEntityCreationTypeName', e => this.setCurrentEntityCreationTypeName({ ...e.detail }));
	document.addEventListener('unsetCurrentEntityCreationTypeName', e => this.unsetCurrentEntityCreationTypeName({ ...e.detail }));
	
	this.entityClickActions = {};

	document.addEventListener('setEntityClickAction', e => this.setEntityClickAction({ ...e.detail }));
	document.addEventListener('unsetEntityClickAction', e => this.unsetEntityClickAction({ ...e.detail }));
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


EntityController.prototype.updateEntity = function({ entityId, updatedNeighborhoodData }) {
 	const entity = this.entityCompendium.get({ id: entityId });

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

EntityController.prototype.performEntityClickAction = function({ entityId }) {
  const entity = this.entityCompendium.get({ id: entityId });
	const actionName = this.entityClickActions[entity.typeName];

	if (!actionName) { throw new Error('entity has not been assigned click action.')};

	const action = entity.actions[actionName].bind(entity);

	return this._performUpdateSelfEntityAction({ entity, action });
};

EntityController.prototype._performUpdateSelfEntityAction = function({ entity, action }) {
	const originalImageDescriptors = entity.imageData.imageDescriptors;

	action();  // entity-bound action

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

EntityController.prototype.getLocationData = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.locationData;
};

EntityController.prototype.getNeighborhoodBlueprints = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.neighborhoodBlueprints;
};

EntityController.prototype.setCurrentEntityCreationTypeName = function({ entityTypeName }) {
	this.currentEntityCreationTypeName = entityTypeName;
};

EntityController.prototype.unsetCurrentEntityCreationTypeName = function() {
	this.currentEntityCreationTypeName = null;
};

EntityController.prototype.setEntityClickAction = function({ entityTypeName, clickActionName }) {
	if (!this.entityTypes[entityTypeName]) {
		throw new Error('cannot set entity click action; cannot find entity.')
	};
		
	const sampleEntity = new this.entityTypes[entityTypeName]();
	const entityActionNames = Object.keys(sampleEntity.actions);

	sampleEntity.selfDestruct();

	if (!entityActionNames.includes(clickActionName)) {
		throw new Error('cannot set entity click action; cannot find action.')
	};

	this.entityClickActions[entityTypeName] = clickActionName;
};

EntityController.prototype.unsetEntityClickAction = function({ entityTypeName }) {
	this.entityClickActions[entityTypeName] = null;
};

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

EntityController.prototype._updateEntityNeighborhoods = function({ entityId, actionableNeighborhoodData, unactionableNeighborhoodData }) {
 	const entity = this.entityCompendium.get({ id: entityId });

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

 		const imageDescriptors = [];

 		if (isValidSpace && occupiedSpaceEntityId) {
	 		const entity = this.entityCompendium.get({ id: occupiedSpaceEntityId });
	 		entity.imageData.imageDescriptors.forEach(descriptor => imageDescriptors.push(descriptor));
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