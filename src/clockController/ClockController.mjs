import Compendium from '../compendium/Compendium.mjs';
import Clock from '../clock/Clock.mjs';

function ClockController() {
	this.clockCompendium = new Compendium();

	document.addEventListener('createClock', e => this.createClock({ ...e.detail }));
	document.addEventListener('tickClock', e => this.tickClock({ ...e.detail }));
	document.addEventListener('toggleClockIteration', e => this.toggleClockIteration({ ...e.detail }));
};

ClockController.prototype.createClock = function({ boardIds, tickFunc }) {
	const clock = new Clock({ boardIds, tickFunc });
	this.clockCompendium.add({ entry: clock });

	const createClockControlsEvent = new CustomEvent(
		'createClockControls',
		{
			detail: {
				boardIds,
				clockId: clock.id,
			}
		}
	);
	document.dispatchEvent(createClockControlsEvent);
};

ClockController.prototype.deleteClock = function({ clockId }) {
	this.clockCompendium.remove({ id: clockId });
};

ClockController.prototype.tickClock = function({ clockId }) {
	const clock = this.clockCompendium.get({ id: clockId });
	clock.tick();
};

ClockController.prototype.toggleClockIteration = function({ clockId, iterationSpeed }) {
	const clock = this.clockCompendium.get({ id: clockId });

	clock.isIterating ? clock.endIteration() : clock.beginIteration({ iterationSpeed });
};

export default ClockController;