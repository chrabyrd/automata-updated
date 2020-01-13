import { Stitch, ZLevelStitchReference } from './StitchReferenceTools.mjs';

function StitchReference({ boardWidth, boardHeight }) {
	this.boardWidth = boardWidth;
	this.boardHeight = boardHeight;

	this.stitchReference = {
		// z-level-up
		[-1]: new ZLevelStitchReference({ boardWidth, boardHeight }),
		// z-level-current
		[0]: new ZLevelStitchReference({ boardWidth, boardHeight }),
		// z-level-down
		[1]: new ZLevelStitchReference({ boardWidth, boardHeight }),
	};
};

StitchReference.prototype.getReferenceKeyFromCoords = function({ x, y, z }) {
	const returnCoords = { x, y, z };

	const reachableBoardWidth = this.boardWidth - 1;
	const reachableBoardHeight = this.boardHeight - 1;

	if (x < 0) {
		returnCoords.x = -1;
	} else if (x <= reachableBoardWidth) {
		returnCoords.x = reachableBoardWidth;
	} else {
		returnCoords.x = this.boardWidth;
	};

	if (y < 0) {
		returnCoords.y = -1;
	} else if (y <= reachableBoardHeight) {
		returnCoords.y = reachableBoardHeight;
	} else {
		returnCoords.y = this.boardHeight;
	};

	if (z < 0) {
		returnCoords.z = -1;
	} else if (z === 0) {
		returnCoords.z = 0;
	} else {
		returnCoords.z = 1;
	};

	return [[returnCoords.z][returnCoords.x, returnCoords.y]];
};

StitchReference.prototype.getRelevantStitchesFromCoords = function({ x, y, z }) {
	const referenceKey = this.stitchReference.getReferenceKeyFromCoords({ ...coords });;
	return this.stitchReference[referenceKey[0]][referenceKey[1]];
};

StitchReference.prototype.getStitchFromCoords = function({ x, y, z }) {
	const relevantStitches = this.getRelevantStitchesFromCoords({ x, y, z });

	let returnStitch = null;

	for (let i = 0; i < relevantStitches.length; i++) {
		const currentStitch = relevantStitches[i];

		if (
			// coords in-between already existing coord range
			currentStitch.localBoardStartCoords.x <= x
			&& currentStitch.localBoardEndCoords.x >= x
			&& currentStitch.localBoardStartCoords.y <= y
			&& currentStitch.localBoardEndCoords.y >= y
		) {
			returnStitch = currentStitch;
			break;
		}
	};

	return returnStitch;
};

StitchReference.prototype.getConflictingStitches = function({ stitch }) {
	const startCoords = stitch.localBoardStartCoords;
	const endCoords = stitch.localBoardEndCoords;

	const conflictingStitches = [];

	[startCoords, endCoords].forEach(coords => {
		const conflictingStitch = this.getStitchFromCoords({ ...startCoords });
		if (conflictingStitch) { conflictingStitches.push(conflictingStitch) };
	});

	// check if new coord range would swallow existing coord range
	const relevantStitches = this.getRelevantStitchesFromCoords({ ...startCoords });

	for (let i = 0; i < relevantStitches.length; i++) {
		const stitch = relevantStitches[i];

		if (
			stitch.localBoardStartCoords.x >= startCoords.x
			&& stitch.localBoardEndCoords.x <= endCoords.x
			&& stitch.localBoardStartCoords.y >= startCoords.y
			&& stitch.localBoardEndCoords.y <= endCoords.y
		) {
			conflictingStitches.push(stitch);
		}
	};

	return conflictingStitches;
};

StitchReference.prototype.add = function({ stitch }) {
	const relevantStitches = this.getRelevantStitchesFromCoords({ ...stitch.localBoardStartCoords });
	relevantStitches.push(stitch);
};

StitchReference.prototype.remove = function({ stitch }) {
	const relevantStitches = this.getRelevantStitchesFromCoords({ ...stitch.localBoardStartCoords });

	let removalIdx = null;

	relevantStitches.forEach((relevantStitch, idx) => {
		if (relevantStitch === stitch) {
			removalIdx = idx;
		}
	});

	relevantStitches.splice(removalIdx, 1);
};

export default StitchReference;