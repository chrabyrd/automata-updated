import UserInputLayer from './UserInputLayer.mjs';
import DrawOutLayer from './DrawOutLayer.mjs';
import Entity from '../entity/entity.mjs';


function Grid ({ minUnitSize, width, height }) {
  this.container = document.createElement('div');

  this.userInputLayer = new UserInputLayer({ width, height, minUnitSize });
  this.drawOutLayer = new DrawOutLayer({ width, height, minUnitSize });

  this.mouseCoords = this.userInputLayer.mouseHoverUnit;

  // this.userInputLayer.canvas.addEventListener('click', e => this.gridClick(e));
};

Grid.prototype.addToDocument = function() {
  this.container.appendChild(this.userInputLayer.canvas);
  this.container.appendChild(this.drawOutLayer.canvas);

  const canvasSection = document.querySelector('#canvas-section');
  canvasSection.appendChild(this.container);
};

Grid.prototype.removeFromDocument = function() {
  this.container.remove();
};

Grid.prototype.update = function({ gridData }) {
  gridData.forEach(gridDatum => {
    this.drawOutLayer.updateOccupiedSpace({ gridDatum });
  });

  this.drawOutLayer.paintToScreen();
};

// Grid.prototype.gridClick = function(e) {
//   const coords = this.userInputLayer.mouseHoverUnit;

//   const gridClick = new CustomEvent(
//     'gridClick',
//     detail: {
//       gridId: this.id,
//       coords,
//       isOccupiedSpace: this.drawOutLayer.isOccupiedSpace({ coords }),
//     },
//   );

//   document.dispatchEvent(gridClick)
// };


export default Grid;