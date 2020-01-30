import ClockControls from './clock-controls.mjs';

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
	const boards = document.querySelectorAll('.board');

	boards.forEach(board => {
		const clockControls = new ClockControls({
			boardIds: [board.id]
		});
		
		this.container.appendChild(clockControls.container);
	});

	document.body.appendChild(this.container);
}

export default BottomPanel;