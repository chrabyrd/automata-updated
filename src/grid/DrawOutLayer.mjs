function DrawOutLayer ({ width, height, minUnitSize }) {
  this.width = width;
  this.height = height;
  this.minUnitSize = minUnitSize;

  this.canvas = this.createCanvas();
};

DrawOutLayer.prototype.createCanvas = function() {
	const canvas = document.createElement('canvas');

	canvas.width = this.width;
	canvas.height = this.height;
	canvas.style.position = 'absolute';

  return canvas;
};

DrawOutLayer.prototype.clear = function() {
  const ctx = this.canvas.getContext('2d');
  ctx.clearRect(0, 0, this.width, this.height);
};

DrawOutLayer.prototype.update = function({ pendingUpdates }) {
  const ctx = this.canvas.getContext('2d');

  Object.values(pendingUpdates).forEach(update => {
    const { coords, color } = update;

    ctx.clearRect(coords.x, coords.y, this.minUnitSize, this.minUnitSize);

    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(coords.x, coords.y, this.minUnitSize, this.minUnitSize);
    }
  });
};

export default DrawOutLayer;