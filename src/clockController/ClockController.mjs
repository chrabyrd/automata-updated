import Compendium from '../compendium/Compendium.mjs';
import Clock from '../clock/Clock.mjs';

function ClockController({ boardCompendium, tickFunc }) {
	this.clockCompendium = new Compendium();

	this.boardCompendium = boardCompendium;
	this.tickFunc = tickFunc;

	document.addEventListener('createClock', e => this.createClock({ ...e.detail }));
};

ClockController.prototype.createClock = function({ boardIds }) {
	const clock = new Clock({ ...clockData });
	this.clockCompendium.add({ entry: clock });
};

ClockController.prototype.deleteClock = function({ clockId }) {
	this.clockCompendium.remove({ id: clockId });
};

ClockController.prototype.tickClock = function({ clockId }) {
	const clock = this.clockCompendium.get({ id: clockId });
	clock.tick();
};

ClockController.prototype.setClockTickInterval = function({ clockId, tickInterval }) {
	const clock = this.clockCompendium.get({ id: clockId });
	clock.setTickInterval({ tickInterval }); // maybe not on clock?
};

ClockController.prototype.clearClockTickInterval = function({ clockId, tickInterval }) {
	const clock = this.clockCompendium.get({ id: clockId });
	clock.clearTickInterval({ tickInterval }); // maybe not on clock?
};

export default ClockController;