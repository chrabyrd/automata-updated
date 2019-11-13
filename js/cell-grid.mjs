class CellGrid {
	constructor(ctx, cellSize) {
		this.ctx = ctx;
		this.cellSize = cellSize;

		this.drawCells = this.drawCells.bind(this);
		this.getCellCoords = this.getCellCoords.bind(this);
	}

	getCellCoords(e) {
		// returns a set of coordinates signifying the top-left corner of the cell
		return([
			Math.floor(e.offsetX/this.cellSize.toFixed(1)) * this.cellSize,
			Math.floor(e.offsetY/this.cellSize.toFixed(1)) * this.cellSize,
		]);
	}

	drawCells({ cellCoords, cellColor }) {
	  this.ctx.beginPath();

	  this.ctx.fillStyle=cellColor;

	  cellCoords.forEach(cell => {
	    this.ctx.rect(cell[0], cell[1], this.cellSize, this.cellSize)
	  })

	  this.ctx.fill();
	}
}

export default CellGrid;