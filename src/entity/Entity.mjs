function Entity ({ size, locationData, userSetImageData, neighborhoodOptions }) {
	this.id = Symbol();
	this.size = size;
	this.tickCount = 0;
	this.neighborhoodBlueprint = [];

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.size;
	this.canvas.height = this.size;

	this.locationData = {
		currentBoardId: null,
		referenceCoords: {
			x: null,
			y: null,
		},
		occupiedSpace: {},
		neighborhood: {};
	};

	this.userSetImageData = {
		color: null,
	};

	this.updateLocationData({ locationData });
	this.updateUserSetImageData({ userSetImageData });
};

Entity.prototype.updateLocationData = function({ locationData }) {
	this.locationData = locationData;
};

Entity.prototype.updateImageData = function({ userSetImageData }) {
	this.userSetImageData = userSetImageData;

	const context = this.canvas.getContext('2d');
	context.fillStyle = userSetImageData.color;

	context.clearRect(0, 0, this.size, this.size);
	context.fillRect(0, 0, this.size, this.size);
};

Entity.prototype.performAction = function() {

};

export default Entity;