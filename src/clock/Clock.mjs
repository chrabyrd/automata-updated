function Clock({ boardTitles, callback }) {
	this.id = Symbol;
	this.tickCount = 0;

	this.boardTitles = boardTitles;
	this.callback = callback;
};

Clock.prototype.addToDocument = function() {

};

Clock.prototype.removeFromDocument = function() {

};

Clock.prototype.tick = function() {
	this.callback();
};

export default Clock;