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

	const referenceKey = this._getReferenceKeyFromCoords({ ...stitch.localBoard.startCoords });

	this.stitchReference[referenceKey[0]][referenceKey[1]].push(stitch);
};

StitchReference.prototype.remove = function({ stitch }) {
	const referenceKey = this._getReferenceKeyFromCoords({ ...stitch.localBoard.startCoords });
	const stitches = this.stitchReference[referenceKey[0]][referenceKey[1]];

	let removalIdx = null;

	stitches.forEach((stitch, idx) => {
		if (relevantStitch === stitch) { removalIdx = idx }
	});

	stitches.splice(removalIdx, 1);

	this.stitchReference[referenceKey[0]][referenceKey[1]] = stitches;
};

StitchReference.prototype.getStitchFromCoords = function({ coords }) {
	const referenceKey = this._getReferenceKeyFromCoords({
		x: coords.x,
		y: coords.y,
		z: 0, 
	});

	const stitches = this.stitchReference[referenceKey[0]][referenceKey[1]];

	let returnStitch = null;

	for (let i = 0; i < stitches.length; i++) {
		const currentStitch = stitches[i];

		if (
			// coords in-between already existing coord range
			currentStitch.localBoard.startCoords.x <= coords.x
			&& currentStitch.localBoard.endCoords.x >= coords.x
			&& currentStitch.localBoard.startCoords.y <= coords.y
			&& currentStitch.localBoard.endCoords.y >= coords.y
		) {
			returnStitch = currentStitch;
			break;
		}
	};

	return returnStitch;
};

StitchReference.prototype._throwStitchingConflicts = function({ stitch }) {
	const startCoords = stitch.localBoard.startCoords;
	const endCoords = stitch.localBoard.endCoords;

	const conflicts = [];

	[startCoords, endCoords].forEach(coords => {
		const conflict = this.getStitchFromCoords({ coords });
		if (conflict) { conflicts.push(conflict) };
	});
	// check if new coord range would swallow existing coord range
	const referenceKey = this._getReferenceKeyFromCoords({ startCoords });
	const existingStitches = this.stitchReference[referenceKey[0]][referenceKey[1]];

	for (let i = 0; i < existingStitches.length; i++) {
		const stitch = existingStitches[i];

		if (
			stitch.localBoard.startCoords.x >= startCoords.x
			&& stitch.localBoard.endCoords.x <= endCoords.x
			&& stitch.localBoard.startCoords.y >= startCoords.y
			&& stitch.localBoard.endCoords.y <= endCoords.y
		) {
			conflicts.push(stitch);
		}
	};

	if (conflicts.length) { throw new Error(`Stitching conflicts ${conflicts}`)}
};

StitchReference.prototype._throwDimensionConflict = function({ stitch }) {
  const getDimensions = ({ startCoords, endCoords }) => ({
    x: endCoords.x - startCoords.x,
    y: endCoords.y - startCoords.y,
  });

  const localBoardStitchDimensions = getDimensions({
    startCoords: stitch.localBoard.startCoords,
    endCoords: stitch.localBoard.endCoords,
  });

  const foreignBoardStitchDimensions = getDimensions({
    startCoords: stitch.foreignBoard.startCoords,
    endCoords: stitch.foreignBoard.endCoords,
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

	return [[returnCoords.z],[returnCoords.x, returnCoords.y]];
};

export default StitchReference;