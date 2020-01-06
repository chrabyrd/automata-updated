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

Controller.prototype.createEntity = function({ entityData, automatonId }) {
	const automaton = this.automatonCompendium.get({ id: automatonId });

	const { size, locationData, imageData, neighborhoodOptions } = entityData;

	const entity = new Entity({
		size,
		locationData,
		imageData,
		neighborhoodOptions,
	});

	automaton.addEntity({ entity });
};

Controller.prototype.deleteEntity = function({ entityData, automatonId }) {

};

export default Controller;