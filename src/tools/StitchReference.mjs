import { ZLevelStitchReference } from '../tools/dataTypes.mjs';

function StitchReference({ relativeBoardWidth, relativeBoardHeight }) {
	this.relativeBoardWidth = relativeBoardWidth;
	this.relativeBoardHeight = relativeBoardHeight;

	this.stitchReference = {
		// z-level-up
		[-1]: new ZLevelStitchReference({ relativeBoardWidth, relativeBoardHeight }),
		// z-level-current
		[0]: new ZLevelStitchReference({ relativeBoardWidth, relativeBoardHeight }),
		// z-level-down
		[1]: new ZLevelStitchReference({ relativeBoardWidth, relativeBoardHeight }),
	};
};

StitchReference.prototype.checkStitchConflicts = function({ stitch }) {
	this._throwStitchingConflicts({ stitch });
	this._throwDimensionConflict({ stitch });
};

StitchReference.prototype.add = function({ stitch }) {
	this.checkStitchConflicts({ stitch });

	const referenceKey = _getReferenceKeyFromCoords({ ...stitch.localBoardStartCoords });
	this.stitchReference[referenceKey[0]][referenceKey[1]].push(stitch);
};

StitchReference.prototype.remove = function({ stitch }) {
	const referenceKey = _getReferenceKeyFromCoords({ ...stitch.localBoardStartCoords });
	const stitches = this.stitchReference[referenceKey[0]][referenceKey[1]];

	let removalIdx = null;

	stitches.forEach((stitch, idx) => {
		if (relevantStitch === stitch) { removalIdx = idx }
	});

	stitches.splice(removalIdx, 1);

	this.stitchReference[referenceKey[0]][referenceKey[1]] = stitches;
};

StitchReference.prototype.getStitchFromCoords = function({ coords }) {
	const referenceKey = _getReferenceKeyFromCoords({ ...coords });
	const stitches = this.stitchReference[referenceKey[0]][referenceKey[1]];

	let returnStitch = null;

	for (let i = 0; i < stitches.length; i++) {
		const currentStitch = stitches[i];

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

StitchReference.prototype._throwStitchingConflicts = function({ stitch }) {
	const startCoords = stitch.localBoardStartCoords;
	const endCoords = stitch.localBoardEndCoords;

	const conflicts = [];

	[startCoords, endCoords].forEach(coords => {
		const conflict = this.getStitchFromCoords({ ...startCoords });
		if (conflict) { conflicts.push(conflict) };
	});

	// check if new coord range would swallow existing coord range
	const referenceKey = _getReferenceKeyFromCoords({ ...coords });
	const existingStitches = this.stitchReference[referenceKey[0]][referenceKey[1]];

	for (let i = 0; i < existingStitches.length; i++) {
		const stitch = existingStitches[i];

		if (
			stitch.localBoardStartCoords.x >= startCoords.x
			&& stitch.localBoardEndCoords.x <= endCoords.x
			&& stitch.localBoardStartCoords.y >= startCoords.y
			&& stitch.localBoardEndCoords.y <= endCoords.y
		) {
			conflicts.push(stitch);
		}
	};

	if (conflicts) { throw new Error(`Stitching conflicts ${conflicts}`)}
};

StitchReference.prototype._throwDimensionConflict = function({ stitch }) {
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

  if (
    localBoardStitchDimensions.x !== foreignBoardStitchDimensions.x
    || localBoardStitchDimensions.y !== foreignBoardStitchDimensions.y
  ) {
  	throw new Error('Need equal stitch dimensions');
  };
};

StitchReference.prototype._getReferenceKeyFromCoords = function({ x, y, z }) {
	const returnCoords = {};

	const reachableBoardWidth = this.relativeBoardWidth - 1;
	const reachableBoardHeight = this.relativeBoardHeight - 1;

	if (x < 0) {
		returnCoords.x = -1;
	} else if (x <= reachableBoardWidth) {
		returnCoords.x = reachableBoardWidth;
	} else {
		returnCoords.x = this.relativeBoardWidth;
	};

	if (y < 0) {
		returnCoords.y = -1;
	} else if (y <= reachableBoardHeight) {
		returnCoords.y = reachableBoardHeight;
	} else {
		returnCoords.y = this.relativeBoardHeight;
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

export default StitchReference;