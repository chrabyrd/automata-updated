const PLAY_PAUSE = 'play-pause';
const NEXT_ITERATION = 'next-iteration';
const ITERATION_SPEED_SLIDER = 'iteration-speed-slider';
const ITERATION_SPEED_NUMBER = 'iteration-speed-number';

function ClockControls({ boardIds, clockId }) {
	this.clockId = clockId;
	this.boardIds = boardIds;
	this.container = document.createElement('div');

	this.isIterating = false;
	this.iterationSpeed = null;

	this.playPauseButton = this.createPlayPauseButton();
	this.nextIterationButton = this.createNextIterationButton();
	this.iterationSpeedControls = this.createIterationSpeedControls();

	[this.playPauseButton, this.nextIterationButton, this.iterationSpeedControls].forEach(input => {
		this.container.appendChild(input);
	});
};

ClockControls.prototype.createPlayPauseButton = function() {
	const playPauseButton = document.createElement('button');
	playPauseButton.innerHTML = String.fromCharCode(0x25B6);

	playPauseButton.addEventListener('click', () => this._toggleClockIteration());

	return playPauseButton;
};

ClockControls.prototype.createNextIterationButton = function() {
	const nextIterationButton = document.createElement('button');
	nextIterationButton.innerHTML = String.fromCharCode(0x23ED);

	const clockTickEvent = new CustomEvent(
		'tickClock', 
		{ 
			detail: { clockId: this.clockId },
		},
	);

	nextIterationButton.addEventListener('click', () => {
		if (this.isIterating) { this._toggleClockIteration() }
		document.dispatchEvent(clockTickEvent);
	});

	return nextIterationButton;
};

ClockControls.prototype.createIterationSpeedControls = function() {
	const container = document.createElement('div');

	const iterationSpeedSlider = document.createElement('input');
	iterationSpeedSlider.type = 'range';
	iterationSpeedSlider.min = 1;
	iterationSpeedSlider.max = 60; // 60fps
	iterationSpeedSlider.value = 30;

	const iterationSpeedNumber = document.createElement('input');
	iterationSpeedNumber.type = 'number';
	iterationSpeedNumber.min = 1;
	iterationSpeedNumber.max = 60;
	iterationSpeedNumber.value = iterationSpeedSlider.value;

	this.iterationSpeed = iterationSpeedNumber.value;

	iterationSpeedSlider.addEventListener('input', e => {
		const iterationSpeed = e.target.value;

		iterationSpeedNumber.value = iterationSpeed;
		this._changeIterationSpeed({ iterationSpeed });
	});
	iterationSpeedNumber.addEventListener('input', e => {
		if (this.isIterating) { this._toggleClockIteration() }

		iterationSpeedSlider.value = e.target.value;
		this.iterationSpeed = iterationSpeedNumber.value;
	});

	[iterationSpeedSlider, iterationSpeedNumber].forEach(elem => {
		container.appendChild(elem);
	});

	return container;
};

ClockControls.prototype._changeIterationSpeed = function({ iterationSpeed }) {
	let wasIterating = false;

	if (this.isIterating) { 
		wasIterating = true;
		this._toggleClockIteration();
	};

	this.iterationSpeed = iterationSpeed;

	if (wasIterating) {
		this._toggleClockIteration();
	};
};

ClockControls.prototype._toggleClockIteration = function() {
	const playButtonLabel = String.fromCharCode(0x25B6);
	const pauseButtonLabel = String.fromCharCode(0x23F8);

	this.isIterating = !this.isIterating;
	this.playPauseButton.innerHTML = this.isIterating ? pauseButtonLabel : playButtonLabel;

	const toggleClockIterationEvent = new CustomEvent(
		'toggleClockIteration',
		{
			detail: { 
				clockId: this.clockId,
				iterationSpeed: this.iterationSpeed 
			}
		}
	);
	document.dispatchEvent(toggleClockIterationEvent);
};

export default ClockControls;