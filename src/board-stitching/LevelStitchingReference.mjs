function LevelStitchings({ boardWidth, boardHeight }) {
	const reachableBoardWidth = boardWidth - 1;
	const reachableBoardHeight = boardHeight - 1;

	const stitchings = {
		// on-board (non-current-z only)
		[reachableBoardWidth, reachableBoardHeight]: [],
		// top
		[reachableBoardWidth, -1]: [],
		// right
		[boardWidth, reachableBoardHeight]: [],
		// bottom
		[reachableBoardWidth, boardHeight]: [],
		// left
		[-1, reachableBoardHeight]: [],
		// top-left-corner
		[-1, -1]: [],
		// top-right-corner
		[boardWidth, -1]: [],
		// bottom-right-corner
		[boardWidth, boardHeight]: [],
		// bottom-left-corner
		[-1, boardHeight]: [],
	};

	return stitchings;
};

function StitchingReference({ boardWidth, boardHeight }) {
	this.stitchings = {
		// z-level-up
		[-1]: new LevelStitchings({ boardWidth, boardHeight }),
		// z-level-current
		[0]: new LevelStitchings({ boardWidth, boardHeight }),
		// z-level-down
		[1]: new LevelStitchings({ boardWidth, boardHeight }),
	};
};

StitchingReference.prototype.getKeyFromCoords = function({ x, y, z }) {
	const returnCoords = { x, y, z };

	const reachableBoardWidth = this.boardWidth - 1;
	const reachableBoardHeight = this.boardHeight - 1;

	if (x <= reachableBoardWidth) {
		returnCoords.x = reachableBoardWidth;
	}
	
	if (y <= reachableBoardHeight) {
		returnCoords.y = reachableBoardHeight;
	}

	return [[returnCoords.z][returnCoords.x, returnCoords.y]];
};

StitchingReference.prototype.getRelevantStitchingsListFromCoords = function({ x, y, z }) {
	const referenceKey = this.stitchings.getKeyFromCoords({ ...coords });;
	return this.stitchings[referenceKey[0]][referenceKey[1]];
};

StitchingReference.prototype.getStitchingFromCoords = function({ x, y, z }) {
	const relevantStitchings = this.getRelevantStitchingsListFromCoords({ coords });

	let returnStitching = null;

	for (let i = 0; i < relaventStitchings.length; i++) {
		const currentStitching = relaventStitchings[i];

		if (
			// coords in-between already existing coord range
			currentStitching.startCoords.x <= x
			&& currentStitching.endCoords.x >= x
			&& currentStitching.startCoords.y <= y
			&& currentStitching.endCoords.y >= y
		) {
			returnStitching = currentStitching;
			break;
		}
	};

	return returnStitching;
};

export default StitchingReference;