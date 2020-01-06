function DrawOutLayer ({ width, height, minUnitSize }) {
  this.minUnitSize = minUnitSize;

  this.occupiedSpace = {};
  this.pendingChanges = [];

  this.canvas = this.createCanvas({ width, height });
};

DrawOutLayer.prototype.createCanvas = function({ width, height }) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	canvas.style.position = 'absolute';

  return canvas;
};

DrawOutLayer.prototype.updateOccupiedSpace = function({ entityOccupiedSpace,   }) {
  const { coords, canvas, size, id } = imageData;

  this.occupiedSpace[coords] = id;

};

DrawOutLayer.prototype.paintToScreen = function() {
  const context = this.canvas.getContext('2d');

  this.pendingChanges.forEach(imageDatum => {
    context.clearRect(imageDatum.coords[0], imageDatum.coords[1], imageDatum.size, imageDatum.size);

    if (imageDatum.color) {
      context.fillStyle = imageDatum.color;
      context.fillRect(imageDatum.coords[0], imageDatum.coords[1], imageDatum.size, imageDatum.size);
    }
  });

  this.pendingChanges = [];
};

DrawOutLayer.prototype.isOccupiedSpace = function({ coords }) {
  return Boolean(this.occupiedSpace[coords]);
};

export default DrawOutLayer;