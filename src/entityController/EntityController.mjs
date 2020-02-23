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

	return entity.id;
};

EntityController.prototype.destroyEntity = function({ entityId }) {
  const entity = this.entityCompendium.get({ id: entityId });
  entity.selfDestruct();

  this.entityCompendium.remove({ id: entityId });
};

EntityController.prototype.requestUpdate = function({ entityId, neighborhoodData }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.requestUpdate({ neighborhoodData });
};

EntityController.prototype.performUpdate = function({ entityId, action }) {
	if (!action) { return null };

 	const entity = this.entityCompendium.get({ id: entityId });

	entity.incrementTickCount();
 	return action.call(entity);
};





EntityController.prototype.performEntityClickAction = function({ entityId }) {
  const entity = this.entityCompendium.get({ id: entityId });
	const actionName = this.entityClickActions[entity.typeName];

	if (!actionName) { throw new Error('entity has not been assigned click action.')};

	const action = entity.actions[actionName].bind(entity);

	return this.performUpdate({ entityId, action });
};




EntityController.prototype.getCanvas = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.canvas;
};

EntityController.prototype.getLocationData = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return entity.locationData;
};

EntityController.prototype.getImageData = function({ entityId }) {
 	const entity = this.entityCompendium.get({ id: entityId });
 	return { ...entity.imageData };
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

EntityController.prototype._updateEntityNeighborhoods = function({ entityId, updatedNeighborhoodData }) {
 	const entity = this.entityCompendium.get({ id: entityId });
	entity.updateNeighborhoods({ ...updatedNeighborhoodData });
};

export default EntityController;