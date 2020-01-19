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
  // disabling transparency improves render speed
  const ctx = this.canvas.getContext('2d', { alpha: false });

  Object.entries(pendingUpdates).forEach(updateTuple => {
    const coords = updateTuple[0];
    const canvas = updateTuple[1];

    ctx.clearRect(coords[0], coords[1], this.minUnitSize, this.minUnitSize);

    if (canvas) {
      ctx.drawImage(canvas, 0, 0);
    }
  });
};

export default DrawOutLayer;