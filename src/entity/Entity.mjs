function Entity ({ size, locationData, imageData, neighborhoodOptions }) {
	this.id = Symbol();
	this.size = size;
	this.tickCount = 0;
	this.neighborhoodBlueprint = {
		actionableNeighborhood: [],
		unactionableNeighborhood: [],
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
		occupiedSpace: {},
		actionableNeighborhood: {},
		unactionableNeighborhood: {},
	};

	this.imageData = {
		color: null,
		descriptors: [],
	};

	this.state = {};

	this.updateLocationData({ locationData });
	this.updateImageData({ imageData });
};

Entity.prototype.updateNeighborhood = function({ actionableNeighborhood, unactionableNeighborhood }) {
	this.locationData.actionableNeighborhood = actionableNeighborhood;
	this.locationData.unactionableNeighborhood = unactionableNeighborhood;
};

Entity.prototype.updateImageData = function({ imageData }) {
	this.imageData = imageData;

	const context = this.canvas.getContext('2d');
	context.fillStyle = imageData.color;

	context.clearRect(0, 0, this.size, this.size);
	context.fillRect(0, 0, this.size, this.size);
};

Entity.prototype.performAction = function() {

	this.tickCount += 1;

};

Entity.prototype.selfDestruct = function() {
	this.locationData = null;
	this.imageData = null;
};

export default Entity;