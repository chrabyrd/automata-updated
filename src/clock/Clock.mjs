function Clock({ tickFunc, boardIds }) {
	this.id = Symbol();

	this.isIterating = false;
	this.iterationSpeed = null;
	this.animationFrame = null;
	this.iterationTimeout = null;

	this.tickFunc = tickFunc;
	this.boardIds = boardIds;

	this._iterationStep = this._iterationStep.bind(this);
};

Clock.prototype.tick = function() {
	return this.tickFunc({ boardIds: this.boardIds });
};

Clock.prototype.beginIteration = function({ iterationSpeed }) {
	this.isIterating = true;
	this.iterationSpeed = iterationSpeed;

	this.animationFrame = requestAnimationFrame(this._iterationStep)
};

Clock.prototype.endIteration = function() {
	clearTimeout(this.iterationTimeout);
	cancelAnimationFrame(this.animationFrame);

	this.isIterating = false;
	this.iterationSpeed = null;
	this.animationFrame = null;
	this.iterationTimeout = null;
};

Clock.prototype._iterationStep = function({ iterationSpeed }) {
	this.iterationTimeout = setTimeout(() => {
		this.tick();
		this.animationFrame = requestAnimationFrame(this._iterationStep);
	}, (1000 / this.iterationSpeed));
};

export default Clock;