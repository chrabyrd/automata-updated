function Clock({ grid }) {

}

Clock.prototype.tick = function(action) {
	action();
}

export default Clock;