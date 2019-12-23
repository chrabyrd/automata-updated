import Compendium from '../compendium/compendium.mjs';
import Grid from '../grid/grid.mjs';
import Entity from '../entity/entity.mjs';
import Clock from '../clock/clock.mjs';


function Automaton ({ gridData }) {
	this.id = Symbol();

	this.tickCount = 0;
  this.entities = {};

	this.grid = new Grid({ ...gridData });

	// this.grid.userInputCanvas.addEventListener('click', e => this.handleClickEvent);
};

Automation.prototype.addEntity = function({ entity }) {
  this.entities[entity.coords] = entity;
  this.grid.update({ imageData: [entity.imageData] });
};

Automation.prototype.removeEntity = function({ coords }) {
  const entity = this.entities[coords];

  delete this.entities[coords];

  this.grid.update({ 
    imageData: {
      coords,
      size: entity.size,
      color: null,
    },
  });
};

Automation.prototype.listEntities = function() {
  return Object.values(this.entities)
};

Automaton.prototype.handleClickEvent = function(e) {
	const coords = this.grid.mouseCoords;

};

Automaton.prototype.tick = function() {

};

export default Automaton;