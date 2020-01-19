import Automaton from '../automaton/Automaton.mjs';
import Compendium from '../compendium/Compendium.mjs';


function Controller() {
	this.automatonCompendium = new Compendium();

	this._addEventListeners();
};

Controller.prototype.createAutomaton = function({ automatonData }) {
	const automaton = new Automaton({ ...automatonData });
	this.automatonCompendium.add({ entry: automaton });
};

Controller.prototype.deleteAutomaton = function({ automatonId }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	this.automatonCompendium.remove({ id: automatonId });
};

Controller.prototype._addEventListeners = function() {
	document.addEventListener('createAutomaton', e => this.createAutomaton(e));

};

export default Controller;