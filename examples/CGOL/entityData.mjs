
export function CGOL2dPieceData({ minUnitSize }) {
	return {
		typeName: 'CGOL2dPiece',
		imageData: {
			color: null,
	    imageDescriptors: ['CGOL2dPiece', 'off'],
		},
		size: minUnitSize,
    neighborhoodBlueprints: {
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
    state: {
    	isOn: false,
    },
    actions: {
    	toggle: function() {
    		this.state.isOn = !this.state.isOn;

    		const imageDescriptors = this.state.isOn ? ['CGOL2dPiece', 'on'] : ['CGOL2dPiece', 'off'];
    		const color = this.state.isOn ? 'blue' : null;

    		this.updateImageData({ color, imageDescriptors });

    		return { entityId: this.id };
    	},
    }, 
    updateLogic: function({ neighborhoodData }) {
    	const neighbors = Object.values(neighborhoodData.actionableNeighborhood);

    	const activeNeighborCount = neighbors.reduce((count, neighborData) => {
    		if (neighborData.imageDescriptors.includes('on')) { count += 1 };
    		return count;
    	}, 0);

    	if (
    		this.state.isOn && activeNeighborCount < 2
    		|| this.state.isOn && activeNeighborCount > 3
    		|| !this.state.isOn && activeNeighborCount === 3
    	) {
    		return {
    			entityId: this.id,
    			action: this.actions.toggle,
    		};
    	};

    },
	};
};