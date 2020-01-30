const PLAY_PAUSE = 'play-pause';
const NEXT_ITERATION = 'next-iteration';
const ITERATION_SPEED_SLIDER = 'iteration-speed-slider';
const ITERATION_SPEED_NUMBER = 'iteration-speed-number';

function ClockControls({ boardIds }) {
	this.boardIds = boardIds;
	this.container = document.createElement('div');

	this.playPauseButton = this.createPlayPauseButton();
	this.nextIterationButton = this.createNextIterationButton();
	this.iterationSpeedControls = this.createIterationSpeedControls();

	[this.playPauseButton, this.nextIterationButton, this.iterationSpeedControls].forEach(input => {
		this.container.appendChild(input);
	});
};

ClockControls.prototype.createPlayPauseButton = function() {
	const playPauseButton = document.createElement('button');
	// const pauseButtonLabel = String.fromCharCode(0x23F8);
	playPauseButton.innerHTML = String.fromCharCode(0x25B6);

	playPauseButton.addEventListener('click', () => {
		const event = new CustomEvent(
		);
		console.log(this.boardIds, PLAY_PAUSE);
	});

	return playPauseButton;
};

ClockControls.prototype.createNextIterationButton = function() {
	const nextIterationButton = document.createElement('button');
	nextIterationButton.innerHTML = String.fromCharCode(0x23ED);

	nextIterationButton.addEventListener('click', () => {
		console.log('nextIterationButton')
	});

	return nextIterationButton;
};

ClockControls.prototype.createIterationSpeedControls = function() {
	const container = document.createElement('div');

	const iterationSpeedSlider = document.createElement('input');
	iterationSpeedSlider.type = 'range';

	const iterationSpeedNumber = document.createElement('input');
	iterationSpeedNumber.type = 'number';
	iterationSpeedNumber.value = iterationSpeedSlider.value;

	iterationSpeedSlider.addEventListener('input', e => {
		iterationSpeedNumber.value = e.target.value;
	});
	iterationSpeedNumber.addEventListener('input', e => {
		iterationSpeedSlider.value = e.target.value;
	});

	[iterationSpeedSlider, iterationSpeedNumber].forEach(elem => {
		container.appendChild(elem);
	});

	return container;
};

export default ClockControls;