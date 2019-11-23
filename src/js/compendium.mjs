function Compendium() {
	this.entries = {};
}

Compendium.prototype.add = function({ entity }) {
	this.entries[entity.id] = entity;
}

Compendium.prototype.list = function() {
	return Object.getOwnPropertySymbols(this.entries).map(key => this.entries[key]);
}

export default Compendium;