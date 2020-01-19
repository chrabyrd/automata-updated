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

Controller.prototype.createBoard = function({ automatonId, boardData }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	automaton.createBoard({ ...boardData });
};

Controller.prototype.deleteBoard = function({ automatonId, boardId }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	automaton.deleteBoard({ boardId });
};

Controller.prototype._addEventListeners = function() {
	const eventListeners = [
		['createAutomaton', e => this.createAutomaton(e.detail)],
		['deleteAutomaton', e => this.deleteAutomaton(e.detail)],
		['createBoard', e => this.createBoard(e.detail)],
		['deleteBoard', e => this.deleteBoard(e.detail)],
	];

	eventListeners.forEach(eventListener => {
		document.addEventListener(eventListener[0], eventListener[1]);
	});
};

export default Controller;