import UserInputCanvas from './user-input-canvas.mjs';
import DrawOutCanvas from './draw-out-canvas.mjs';


function Grid ({ minUnitSize, width, height }) {
	this.id = Symbol();

  this.minUnitSize = minUnitSize;

  this.userInputCanvas = new UserInputCanvas({ width, height, minUnitSize });
  this.drawOutCanvas = new DrawOutCanvas({ width, height, minUnitSize });

  this.createCanvasElements({ width, height });

  document.addEventListener('userInputCanvasClick', e => this.createEntity(e));
};

Grid.prototype.createCanvasElements = function({ width, height }) {
  const canvasSection = document.querySelector('#canvas-section');

  const container = document.createElement('div');
  
  container.style.width = `${this.width}px`;
  container.style.height = `${this.height}px`;
  container.style.outline = '1px solid black';

  container.appendChild(this.userInputCanvas.canvas);
  container.appendChild(this.drawOutCanvas.canvas);
  canvasSection.appendChild(container);
};

Grid.prototype.createEntity = function(e) {
  const coords = [e.detail.x, e.detail.y];

  //  make this toggleable
  if (this.drawOutCanvas.isOccupiedSpace({ coords })) return;

  const unitData = {
    color: 'green',
    coords,
    size: this.minUnitSize,
  };

  const createEntityEvent = new CustomEvent(
    'createEntity', 
    { 
      detail: {
        ...unitData,
        gridId: this.id,
      },
    },
  );

  document.dispatchEvent(createEntityEvent);

  this.drawOutCanvas.updateOccupiedSpace({
    newData: [unitData],
  })

  this.drawOutCanvas.paintToScreen();
};


export default Grid;