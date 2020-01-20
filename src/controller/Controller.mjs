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

Controller.prototype.boardClick = function({ clickData }) {
	console.log(clickData);

	const automaton = this.automatonCompendium.get({ id: clickData.automatonId });

	const entityData = {
		size: 25,
		locationData: {
			boardId: clickData.boardId,
			coords: clickData.coords,
		},
		imageData: {
			color: 'yellow',
			descriptors: ['on'],
		},
		neighborhoodBlueprint: {
			actionableNeighborhood: [
				{ x: -1, y: -1, z: 0, },
				{ x: 0, y: -1, z: 0, },
				{ x: 1, y: -1, z: 0, },
				{ x: 1, y: 0, z: 0, },
				{ x: 1, y: 1, z: 0, },
				{ x: 0, y: 1, z: 0, },
				{ x: -1, y: 1, z: 0, },
				{ x: -1, y: 0, z: 0, },
			],
			unactionableNeighborhood: [],
		},
	};

	automaton.createEntity({ entityData });
};

Controller.prototype.deleteBoard = function({ automatonId, boardId }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	automaton.deleteBoard({ boardId });
};

Controller.prototype.createEntity = function({ automatonId, entityData }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	automaton.createEntity({ ...entityData });
};

Controller.prototype.deleteEntity = function({ automatonId, entity }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });
	automaton.deleteEntity({ entity });
};

Controller.prototype._addEventListeners = function() {
	const eventListeners = [
		['createAutomaton', e => this.createAutomaton(e.detail)],
		['deleteAutomaton', e => this.deleteAutomaton(e.detail)],
		['createBoard', e => this.createBoard(e.detail)],
		['boardClick', e => this.boardClick(e.detail)],
		['deleteBoard', e => this.deleteBoard(e.detail)],
		['createEntity', e => this.createEntity(e.detail)],
		['deleteEntity', e => this.deleteEntity(e.detail)],
	];

	eventListeners.forEach(eventListener => {
		document.addEventListener(eventListener[0], eventListener[1]);
	});
};

export default Controller;