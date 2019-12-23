import Entity from '../entity/Entity.mjs';
import Automaton from '../automaton/Automaton.mjs';
import Compendium from '../compendium/Compendium.mjs';


function Controller() {
	this.automatonCompendium = new Compendium();
	// this.entityCompendium = new Compendium();

	document.addEventListener('createAutomaton', e => this.createAutomaton(e));
};

Controller.prototype.createAutomaton = function({ automatonData }) {
	const automaton = new Automaton({ ...automatonData });
	this.automatonCompendium.add({ entry: automaton });

	automaton.grid.addToDocument();
};

Controller.prototype.deleteAutomaton = function({ automatonId }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	this.automatonCompendium.remove({ id: automatonId });

	automaton.grid.removeFromDocument();
};

export default Controller;