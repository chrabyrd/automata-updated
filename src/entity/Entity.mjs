function Entity ({ size, locationData, imageData, neighborhoodBlueprints }) {
	this.id = Symbol();
	this.size = size;

	this.tickCount = 0;

	this.neighborhoodBlueprints = {
		actionableNeighborhood: [],
		unactionableNeighborhood: [],
	};

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

	this.imageData = {
		color: null,
		descriptors: [],
	};

	this.state = {};

	this.updateImageData({ imageData });
	this.updateLocationData({ locationData });
	this.updateNeighborhoodBlueprint({ neighborhoodBlueprints });
};

Entity.prototype.updateImageData = function({ imageData }) {
	this.imageData = imageData;

	const context = this.canvas.getContext('2d');
	context.fillStyle = imageData.color;

	context.clearRect(0, 0, this.size, this.size);
	context.fillRect(0, 0, this.size, this.size);
};

Entity.prototype.updateLocationData = function({ locationData }) {
	this.locationData.boardId = locationData.boardId;
	this.locationData.coords = locationData.coords;
};

Entity.prototype.updateNeighborhoodBlueprint = function({ neighborhoodBlueprints }) {
	this.neighborhoodBlueprints.actionableNeighborhood = neighborhoodBlueprints.actionableNeighborhood;
	this.neighborhoodBlueprints.unactionableNeighborhood = neighborhoodBlueprints.unactionableNeighborhood;
};

Entity.prototype.updateNeighborhood = function({ actionableNeighborhood, unactionableNeighborhood }) {
	this.neighborhoods.actionableNeighborhood = actionableNeighborhood;
	this.neighborhoods.unactionableNeighborhood = unactionableNeighborhood;
};

Entity.prototype.performAction = function() {
	this.tickCount += 1;

};

Entity.prototype.selfDestruct = function() {
	this.locationData = null;
	this.imageData = null;
};

export default Entity;