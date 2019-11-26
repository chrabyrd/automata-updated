function Grid ({ unitSize, width, height }) {
	this.id = Symbol();

	this.unitSize = unitSize;
	this.width = width;
	this.height = height;
	this.ctx = null;
}

Grid.prototype.createCanvas = function() {
  const container = document.querySelector('#canvas-container');
  const canvas = document.createElement('canvas');

  [container, canvas].forEach(elem => {
    elem.width = this.width;
    elem.height = this.height;
  });

  container.appendChild(canvas);
  
  this.ctx = canvas.getContext('2d');
};

export default Grid;