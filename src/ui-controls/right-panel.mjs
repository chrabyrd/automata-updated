
function RightPanel() {
	this.container = document.createElement('div');
	this.container.style.width = '10vw';
	this.container.style.height = '100vh';
	this.container.style.position = 'fixed';
	this.container.style.right = '0';
	this.container.style.bottom = '0';
	this.container.style.zIndex = '2';
	this.container.style.borderLeft = '1px solid black';
	this.container.style.background = 'snow';


	document.body.appendChild(this.container);
}

export default RightPanel;