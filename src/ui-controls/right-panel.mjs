import MouseControls from './mouse-controls/mouse-controls.mjs';
import MouseAreaInformation from './mouse-area-information/mouse-area-information.mjs';

function RightPanel() {
	this.container = document.createElement('div');
	this.container.style.width = '15vw';
	this.container.style.height = '100vh';
	this.container.style.position = 'fixed';
	this.container.style.right = '0';
	this.container.style.bottom = '0';
	this.container.style.zIndex = '2';
	this.container.style.borderLeft = '1px solid black';
	this.container.style.background = 'snow';
	this.container.style.display = 'flex';
	this.container.style.justifyContent = 'center';

	// const mouseControls = new MouseControls();

	const mouseAreaInformation = new MouseAreaInformation();
	this.container.appendChild(mouseAreaInformation);

	document.body.appendChild(this.container);
}

export default RightPanel;