function Entity ({ typeName, size, imageData, neighborhoodBlueprints, updateLogic, state, actions }) {
	this.id = Symbol();
	this.typeName = typeName;
	this.size = size;

	this.tickCount = 0;

	this.neighborhoodBlueprints = { ...neighborhoodBlueprints };

	this.locationData = {
		boardId: null,
		coords: {
			x: null,
			y: null,
		},
	};

	this.imageData = { ...imageData };

	// important to clone state as to not share
	// between instances!
	this.state = { ...state };
	this.actions = { ...actions };

	this.updateLogic = updateLogic;
};

Entity.prototype.updateImageData = function({ color, imageDescriptors }) {
	this.imageData = { color, imageDescriptors };
};

Entity.prototype.updateLocationData = function({ locationData }) {
	this.locationData.boardId = locationData.boardId;
	this.locationData.coords = locationData.coords;
};

Entity.prototype.requestUpdate = function({ neighborhoodData }) {
	return this.updateLogic({ neighborhoodData });
};

Entity.prototype.incrementTickCount = function() {
	this.tickCount += 1;
};

Entity.prototype.selfDestruct = function() {
	this.locationData = null;
	this.imageData = null;
	this.canvas = null;
};

export default Entity;