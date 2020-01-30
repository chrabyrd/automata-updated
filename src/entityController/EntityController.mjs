function EntityController({ boardCompendium }) {
	this.boardCompendium = boardCompendium;
};

EntityController.prototype.createEntity = function({ entityData }) {
	//  only to be used to handle user input ???
	const entity = new Entity({ ...entityData });
	const board = this.boardCompendium.get({ id: entity.locationData.boardId });

	board.addEntity({ entity });
};

EntityController.prototype.destroyEntity = function({ entity }) {
	  //  only to be used to handle user input ???
  const board = this.boardCompendium.get({ id: entity.locationData.boardId });

  board.removeEntity({ entity });
  entity.selfDestruct();
};

EntityController.prototype.updateEntity = function() {
	const neighborhoodBlueprints = entity.getNeighborhoodBlueprints();

	const neighborhood = neighborhoodBlueprints.reduce((acc, relativeCoords) => {
	  acc[relativeCoords] = this._findRelativeCoordData({
	    currentBoardId: entity.locationData.currentBoardId,
	    referenceCoords: entity.locationData.referenceCoords,
	    relativeCoords,
	  });
	}, {});

	entity.updateNeighborhood({ entity, neighborhood });

	const { originalLocationData, originalImageData } = entity;

	// entity outputs external actions?
	entity.performAction();

	const { newLocationData, newImageData } = entity;

	if (!newLocationData) {
	  const board = this.boardCompendium.get(originalLocationData.boardId);
	  board.removeEntity({ entity });
	} else if (originalLocationData.boardId !== newLocationData.boardId) {
	  const originalBoard = this.boardCompendium.get(originalLocationData.boardId);
	  const newBoard = this.boardCompendium.get(newLocationData.boardId);

	  originalBoard.removeEntity({ entity });
	  newBoard.addEntity({ entity });
	} else if (
	  originalLocationData.coords !== newLocationData.coords
	  || originalImageData !== newImageData
	) {
	  const board = this.boardCompendium.get(originalLocationData.boardId);
	  board.updateLocationData({ 
	    previousLocationData: originalLocationData, 
	    entity,
	  });
	};
};

export default EntityController;