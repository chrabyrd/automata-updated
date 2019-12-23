function Compendium() {
	this.entries = {};
}

Compendium.prototype.add = function({ entry }) {
	if (!this.entries[entry.id]) {
		this.entries[entry.id] = entry;
	}
}

Compendium.prototype.update = function({ entry }) {
	if (this.entries[entry.id]) {
		this.entries[entry.id] = entry;
	}
}

Compendium.prototype.get = function({ id }) {
	return this.entries[id];
}

Compendium.prototype.list = function() {
	return Object.getOwnPropertySymbols(this.entries).map(key => this.entries[key]);
}

Compendium.prototype.remove = function({ id }) {
	delete this.entries[id];
}

export default Compendium;