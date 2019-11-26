function Compendium() {
	this.entries = {};
}

Compendium.prototype.add = function({ entry }) {
	this.entries[entry.id] = entry;
}

Compendium.prototype.list = function() {
	return Object.getOwnPropertySymbols(this.entries).map(key => this.entries[key]);
}

export default Compendium;