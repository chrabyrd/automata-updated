import { Stitch, ZLevelStitchReference } from './StitchReferenceTools.mjs';

function StitchReference({ boardWidth, boardHeight }) {
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

	if (x <= reachableBoardWidth) {
		returnCoords.x = reachableBoardWidth;
	}
	
	if (y <= reachableBoardHeight) {
		returnCoords.y = reachableBoardHeight;
	}

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
			&& currentStitch.endCoords.x >= x
			&& currentStitch.localBoardStartCoords.y <= y
			&& currentStitch.endCoords.y >= y
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

StitchReference.prototype.createStitchFromData = function({ stitchData }) {
	return new Stitch({ ...stitchData });
};

StitchReference.prototype.areStitchDimensionsEqual = function({ stitch }) {
  const getDimensions = ({ startCoords, endCoords }) => ({
    x: endCoords.x - startCoords.x,
    y: endCoords.y - startCoords.y,
  });

  const localBoardStitchDimensions = getDimensions({
    startCoords: stitch.localBoardStartCoords,
    endCoords: stitch.localBoardEndCoords,
  });

  const foreignBoardStitchDimensions = getDimensions({
    startCoords: stitch.foreignBoardStartCoords,
    endCoords: stitch.foreignBoardEndCoords,
  });

  return (
    localBoardStitchDimensions.x === foreignBoardStitchDimensions.x
    && localBoardStitchDimensions.y === foreignBoardStitchDimensions.y
  );
};

StitchReference.prototype.addStitchToReference = function({ stitch }) {
	const relevantStitches = this.getRelevantStitchesFromCoords({ ...stitch.localBoardStartCoords });
	relevantStitches.push(stitch);
};

StitchReference.prototype.removeStitchFromReference = function({ stitch }) {
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