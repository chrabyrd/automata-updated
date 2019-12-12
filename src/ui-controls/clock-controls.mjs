function ClockControls() {
	const container = document.createElement('div');

	const playButtonLabel = String.fromCharCode(0x25B6);
	const pauseButtonLabel = String.fromCharCode(0x23F8);
	const nextIterationButtonLabel = String.fromCharCode(0x23ED);

	const playPauseButton = document.createElement('button');
	const nextIterationButton = document.createElement('button');

	playPauseButton.innerHTML = playButtonLabel;
	nextIterationButton.innerHTML = nextIterationButtonLabel;

	const iterationSpeedSlider = document.createElement('input');
	iterationSpeedSlider.type = 'range';


	return { playPauseButton, nextIterationButton, iterationSpeedSlider }
}

export default ClockControls;