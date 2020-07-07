
function MouseAreaInformation() {
	this.container = document.createElement('div');
	this.container.style.background = 'white';
	this.container.style.alignSelf = 'flex-end';
	this.container.style.padding = '10px';

	const header = this._createHeader();
	const selectedInformationArea = this._createSelectedInformationArea();
	const hoverInformationArea = this._createHoverInformationArea();

	[
		header,
		hoverInformationArea,
		selectedInformationArea,
	].forEach(elem => this.container.appendChild(elem));

	return this.container;
};

MouseAreaInformation.prototype._createHeader = function() {
	const container = document.createElement('div');
	const text = document.createTextNode('Information');

	container.style.textAlign = 'center';
	container.style.fontSize = '1.5em';
	container.style.padding = '0.5em';
	
	container.appendChild(text);

	return container;
};

MouseAreaInformation.prototype._createSelectedInformationArea = function() {
	const container = document.createElement('div');
	const text = document.createTextNode('Selected Area:');
	
	container.appendChild(text);

	return container;
};

MouseAreaInformation.prototype._createHoverInformationArea = function() {
	const container = document.createElement('div');
	const text = document.createTextNode('Mouse Hover Area:');
	
	container.appendChild(text);

	return container;
};

export default MouseAreaInformation;