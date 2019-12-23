function Entity ({ coords, size, color }) {
	this.id = Symbol();

	this.coords = coords;
	this.size = size;

	this.canvas = document.createElement('canvas');
	this.context = canvas.getContext('2d');

	canvas.width = size;
	canvas.height = size;

	this.image = this.updateImage({ color: 'green' });
}

Entity.prototype.updateImage = function({ color }) {
	this.context.clearRect(0, 0, this.size, this.size);

	this.context.fillStyle = color;
	this.context.fillRect(0, 0, this.size, this.size);

	return this.canvas;
}

Entity.prototype.performAction = function() {

};

export default Entity;