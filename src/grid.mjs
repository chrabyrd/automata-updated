function Grid ({ unitSize, width, height }) {
	this.id = Symbol();

	this.unitSize = unitSize;
	this.width = width;
	this.height = height;

  this.userInputCanvas = null;
  this.drawOutCanvas = null;

  this.mouseHoverUnit = {
    x: null,
    y: null,
  };

  this.createCanvases();

  this.userInputCanvas.addEventListener('mousemove', e => this.mouseMoveEvent(e));
  this.userInputCanvas.addEventListener('mouseleave', e => this.mouseLeaveEvent(e));
}

Grid.prototype.createCanvases = function() {
  const canvasSection = document.querySelector('#canvas-section');

  const container = document.createElement('div');
  const userInputCanvas = document.createElement('canvas');
  const drawOutCanvas = document.createElement('canvas');

  [userInputCanvas, drawOutCanvas].forEach(elem => {
    elem.style.position = 'absolute';
    elem.width = this.width;
    elem.height = this.height;
  });

  userInputCanvas.style.zIndex = 1;
  
  container.style.width = `${this.width}px`;
  container.style.height = `${this.height}px`;
  container.style.outline = '1px solid black';

  container.appendChild(userInputCanvas);
  container.appendChild(drawOutCanvas);
  canvasSection.appendChild(container);

  this.userInputCanvas = userInputCanvas;
  this.drawOutCanvas = drawOutCanvas;
};

Grid.prototype.getUnitCoords = function({ x, y }) {
  // returns a set of coordinates signifying the top-left corner of the cell
  if (this.unitSize > 1) {
    x = Math.floor(x/this.unitSize.toFixed(1)) * this.unitSize;
    y = Math.floor(y/this.unitSize.toFixed(1)) * this.unitSize;
  };

  return { x, y };
};

Grid.prototype.mouseMoveEvent = function(e) {
  let { x, y } = this.getUnitCoords({
    x: e.x,
    y: e.y,
  });

  if ( this.mouseHoverUnit.x !== x || this.mouseHoverUnit.y !== y ) {
    const context = this.userInputCanvas.getContext('2d');

    context.clearRect(0, 0, this.width, this.height);

    this.mouseHoverUnit = { x, y };

    context.beginPath();
    context.rect(this.mouseHoverUnit.x, this.mouseHoverUnit.y, this.unitSize, this.unitSize);
    context.stroke();
    context.closePath();
  } 
};

Grid.prototype.mouseLeaveEvent = function(e) {
  const context = this.userInputCanvas.getContext('2d');
  context.clearRect(0, 0, this.width, this.height);
};

export default Grid;