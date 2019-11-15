function Entity ({ coords, size, color }) {
	this.id = Symbol();

	this.imageData = {
		coords,
		color,
		size,
	};
}

Entity.prototype.performAction = function() {

};

Entity.prototype.paintToScreen = function({ ctx }) {
	const { coords, size, color } = this.imageData;

	ctx.clearRect(coords[0], coords[1], size, size);

	ctx.fillStyle = color;
  ctx.fillRect(coords[0], coords[1], size, size);
};

export default Entity;