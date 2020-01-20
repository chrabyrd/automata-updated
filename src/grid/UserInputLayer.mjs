function UserInputLayer ({ width, height, minUnitSize }) {
	this.minUnitSize = minUnitSize;
  this.mouseHoverUnit = {
    x: null,
    y: null,
  };

  this.canvas = this.createCanvas({ width, height });

  this.canvas.addEventListener('mousemove', e => this.mouseMoveEvent(e));
  this.canvas.addEventListener('mouseleave', e => this.mouseLeaveEvent(e));
};

UserInputLayer.prototype.createCanvas = function({ width, height }) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	canvas.style.position = 'absolute';
	canvas.style.zIndex = 2;

  return canvas;
};

UserInputLayer.prototype.getUnitCoords = function({ x, y }) {
  const returnCoords = {};

  returnCoords.x = Math.floor(x/this.minUnitSize.toFixed(1)) * this.minUnitSize;
  returnCoords.y = Math.floor(y/this.minUnitSize.toFixed(1)) * this.minUnitSize;

  return returnCoords;
};

UserInputLayer.prototype.mouseMoveEvent = function(e) {
  let { x, y } = this.getUnitCoords({
    x: e.layerX,
    y: e.layerY,
  });

  if ( this.mouseHoverUnit.x !== x || this.mouseHoverUnit.y !== y ) {
    const context = this.canvas.getContext('2d');

    //  necessary for proper clearing
    context.clearRect(this.mouseHoverUnit.x - 1, this.mouseHoverUnit.y - 1, this.minUnitSize * 1.1, this.minUnitSize * 1.1);

    this.mouseHoverUnit = { x, y };

    context.strokeRect(this.mouseHoverUnit.x, this.mouseHoverUnit.y, this.minUnitSize, this.minUnitSize);
  } 
};

UserInputLayer.prototype.mouseLeaveEvent = function(e) {
  const context = this.canvas.getContext('2d');
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.mouseHoverUnit = {
    x: null,
    y: null,
  };
};

export default UserInputLayer;