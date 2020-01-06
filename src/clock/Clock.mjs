import Compendium from '../compendium/Compendium.mjs';

function Clock() {
	this.id = Symbol;

	this.automatonCompendium = new Compendium();
};



Clock.prototype.addAutomaton = function({ automaton }) {
	this.automatonCompendium.add({ entry: automaton });
};

Clock.prototype.removeAutomaton = function({ automatonId }) {
	this.automatonCompendium.remove({ id: automatonId });
};

Clock.prototype.tick = function() {
	const automata = this.automatonCompendium.list();
};