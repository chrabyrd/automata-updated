import Compendium from '../compendium/compendium.mjs';


function Automaton () {
	this.id = Symbol();

  this.boardController = new BoardController();
  this.clockController = new ClockController();

  this.entityController = new EntityController({
    boardCompendium: this.boardController.boardCompendium,
  });

  const eventListeners = [
    ['createBoard', e => this.createBoard(e.detail)],
    ['destroyBoard', e => this.destroyBoard(e.detail)],
    ['stitchBoards', e => this.stitchBoards(e.detail)],
    ['unstitchBoards', e => this.unstitchBoards(e.detail)],
    ['boardClick', e => this.boardClick(e.detail)],

    ['createClock', e => this.createClock(e.detail)],
    ['destroyClock', e => this.destroyClock(e.detail)],
    ['clockTick', e => this.clockTick(e.detail)],

    ['createEntity', e => this.createEntity(e.detail)],
    ['deleteEntity', e => this.deleteEntity(e.detail)],
  ];

  eventListeners.forEach(eventListener => {
    document.addEventListener(eventListener[0], eventListener[1]);
  });
};

Automaton.prototype.createBoard = function({ boardData }) {
};

Automaton.prototype.destroyBoard = function({ boardId }) {
};

Automaton.prototype.boardClick = function({ clickData }) {
  const entityData = {
    size: 25,
    locationData: {
      boardId: clickData.boardId,
      coords: clickData.coords,
    },
    imageData: {
      color: 'orange',
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

Automaton.prototype.stitchBoards = function({ board1StitchData, board2StitchData }) {
};

Automaton.prototype.unstitchBoards = function({ stitch }) {
};

Automaton.prototype.createEntity = function({ entityData }) {
};

Automaton.prototype.deleteEntity = function({ entity }) {
};

Automaton.prototype.updateEntity = function({ entity }) {
};


export default Automaton;