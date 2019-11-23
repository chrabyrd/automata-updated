function Clock() {}

Clock.prototype.tick = function(action) {
	action();
}

export default Clock;