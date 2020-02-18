function Entity ({ typeName, size, imageData, neighborhoodBlueprints, updateLogic, state, actionList }) {
	this.id = Symbol();
	this.typeName = typeName;
	this.size = size;

	this.tickCount = 0;

	this.neighborhoodBlueprints = neighborhoodBlueprints;

	this.neighborhoods = {
		actionableNeighborhood: {},
		unactionableNeighborhood: {},
	};

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.size;
	this.canvas.height = this.size;

	this.locationData = {
		boardId: null,
		coords: {
			x: null,
			y: null,
		},
	};

	this.imageData = imageData;

	this.state = state;

	this.updateLogic = updateLogic;

	this.actionList = actionList;

	this._updateCanvas();
};

Entity.prototype.updateImageData = function({ color, imageDescriptors }) {
	this.imageData = { color, imageDescriptors };
	this._updateCanvas();
};

Entity.prototype.updateLocationData = function({ locationData }) {
	this.locationData.boardId = locationData.boardId;
	this.locationData.coords = locationData.coords;
};

Entity.prototype.updateNeighborhoods = function({ actionableNeighborhood, unactionableNeighborhood }) {
	this.neighborhoods.actionableNeighborhood = actionableNeighborhood;
	this.neighborhoods.unactionableNeighborhood = unactionableNeighborhood;
};

Entity.prototype.requestUpdate = function() {
	return this.updateLogic();
};

Entity.prototype.incrementTickCount = function() {
	this.tickCount += 1;
};

Entity.prototype.selfDestruct = function() {
	this.locationData = null;
	this.imageData = null;
	this.canvas = null;
};

Entity.prototype._updateCanvas = function() {
	const context = this.canvas.getContext('2d');

	context.clearRect(0, 0, this.size, this.size);

	if (this.imageData.color) {
		context.fillStyle = this.imageData.color;
		context.fillRect(0, 0, this.size, this.size);
	};
};

export default Entity;