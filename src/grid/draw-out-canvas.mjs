function DrawOutCanvas ({ width, height }) {
  this.occupiedSpace = {};
  this.pendingChanges = [];

  this.canvas = this.createCanvas({ width, height });
};

DrawOutCanvas.prototype.createCanvas = function({ width, height }) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	canvas.style.position = 'absolute';

	return canvas;
};

DrawOutCanvas.prototype.updateOccupiedSpace = function({ newData }) {
  newData.forEach(datum => {
    if (
      !this.occupiedSpace[datum.coords]
      || this.occupiedSpace[datum.coords] && this.occupiedSpace[datum.coords] !== datum
    ) {
      this.pendingChanges.push(datum);
      this.occupiedSpace[datum.coords] = datum;
    }
  })
};

DrawOutCanvas.prototype.paintToScreen = function() {
  this.pendingChanges.forEach(datum => {
    const context = this.canvas.getContext('2d');

    context.clearRect(datum.coords[0], datum.coords[1], datum.size, datum.size);

    context.beginPath();
    context.fillStyle = datum.color;
    context.fillRect(datum.coords[0], datum.coords[1], datum.size, datum.size);
    context.closePath();
  });

  this.pendingChanges = [];
};

DrawOutCanvas.prototype.isOccupiedSpace = function({ coords }) {
  return Boolean(this.occupiedSpace[coords]);
};

export default DrawOutCanvas;