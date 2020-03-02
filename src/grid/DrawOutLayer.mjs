function DrawOutLayer ({ width, height, minUnitSize }) {
  this.minUnitSize = minUnitSize;
  this.canvas = this.createCanvas({ width, height });
};

DrawOutLayer.prototype.createCanvas = function({ width, height }) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	canvas.style.position = 'absolute';

  return canvas;
};

DrawOutLayer.prototype.update = function({ pendingUpdates }) {
  const ctx = this.canvas.getContext('2d');

  Object.values(pendingUpdates).forEach(update => {
    const { coords, color } = update;

    ctx.clearRect(coords.x, coords.y, this.minUnitSize, this.minUnitSize);

    if (color) {

      ctx.fillStyle = color;
      ctx.fillRect(coords.x, coords.y, this.minUnitSize, this.minUnitSize);

      // ctx.drawImage(canvas, coords.x, coords.y);
    }
  });
};

export default DrawOutLayer;