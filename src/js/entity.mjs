function Entity ({ coords, size, color, gridId }) {
	this.id = Symbol();

	this.imageData = {
		coords,
		color,
		size,
		gridId,
	};
}

Entity.prototype.performAction = function() {

};

export default Entity;