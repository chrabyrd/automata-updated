import ClockControls from './clock-controls.mjs';
import BoardControls from './board-controls/board-controls.mjs';

function BottomPanel() {
	this.container = document.createElement('div');
	this.container.style.width = '100vw';
	this.container.style.height = '10vh';
	this.container.style.position = 'fixed';
	this.container.style.bottom = '0';
	this.container.style.zIndex = '2';
	this.container.style.borderTop = '1px solid black';
	this.container.style.background = 'snow';

	// to be done in a modal
	document.addEventListener('createClockControls', e => {
		const clockControls = new ClockControls({ ...e.detail });
		this.container.appendChild(clockControls.container);
	});


	const boardControls = new BoardControls();
	this.container.appendChild(boardControls.container)

	document.body.appendChild(this.container);
}

export default BottomPanel;