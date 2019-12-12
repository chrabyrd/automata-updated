function UserInputCanvas ({ width, height, minUnitSize }) {
	this.minUnitSize = minUnitSize;
  this.mouseHoverUnit = {
    x: null,
    y: null,
  };

  this.canvas = this.createCanvas({ width, height });

  this.canvas.addEventListener('mousemove', e => this.mouseMoveEvent(e));
  this.canvas.addEventListener('mouseleave', e => this.mouseLeaveEvent(e));
  this.canvas.addEventListener('click', e => this.clickEvent(e));
};

UserInputCanvas.prototype.createCanvas = function({ width, height }) {
	const canvas = document.createElement('canvas');

	canvas.width = width;
	canvas.height = height;
	canvas.style.position = 'absolute';
	canvas.style.zIndex = 2;

	return canvas;
};

UserInputCanvas.prototype.getUnitCoords = function({ x, y }) {
  // returns a set of coordinates signifying the top-left corner of the cell
  if (this.minUnitSize > 1) {
    x = Math.floor(x/this.minUnitSize.toFixed(1)) * this.minUnitSize;
    y = Math.floor(y/this.minUnitSize.toFixed(1)) * this.minUnitSize;
  };

  return { x, y };
};

UserInputCanvas.prototype.mouseMoveEvent = function(e) {
  let { x, y } = this.getUnitCoords({
    x: e.layerX,
    y: e.layerY,
  });

  if ( this.mouseHoverUnit.x !== x || this.mouseHoverUnit.y !== y ) {
    const context = this.canvas.getContext('2d');

    //  necessary for proper clearing
    context.clearRect(this.mouseHoverUnit.x - 1, this.mouseHoverUnit.y - 1, this.minUnitSize * 1.1, this.minUnitSize * 1.1);

    this.mouseHoverUnit = { x, y };

    context.beginPath();
    context.strokeRect(this.mouseHoverUnit.x, this.mouseHoverUnit.y, this.minUnitSize, this.minUnitSize);
    context.closePath();
  } 
};

UserInputCanvas.prototype.mouseLeaveEvent = function(e) {
  const context = this.canvas.getContext('2d');
  context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.mouseHoverUnit = {
    x: null,
    y: null,
  };
};


UserInputCanvas.prototype.clickEvent = function(e) {
  const { x, y } = this.getUnitCoords({ 
    x: e.x, 
    y: e.y,
  });

  const userInputCanvasClickEvent = new CustomEvent(
    'userInputCanvasClick', 
    { 
      detail: { x, y },
    },
  );

  document.dispatchEvent(userInputCanvasClickEvent);
};

export default UserInputCanvas;