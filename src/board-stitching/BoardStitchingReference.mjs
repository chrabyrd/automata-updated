function BoardStitchingController({ boardWidth, boardHeight }) {
	this.stitchingReference = new StitchingReference({ boardWidth, boardHeight });
};

BoardStitchingController.prototype.getConflictingStitchings = function({ stitchings, boardStitching }) {
	const { startCoords, endCoords, stitchedBoardId } = boardStitching;

	const conflictingStitchings = [];

	[startCoords, endCoords].forEach(coords => {
		const conflictingStitching = this.getStitchingsListFromCoords({ coords });
		if (conflictingStitching) { conflictingStitchings.push(conflictingStitching) };
	});

	for (let i = 0; i < stitchings.length; i++) {
		const stitching = stitchings[i];

		if (
			// new coord range would swallow existing coord range
			stitching.startCoords.x >= startCoords.x
			&& stitching.endCoords.x <= endCoords.x
			&& stitching.startCoords.y >= startCoords.y
			&& stitching.endCoords.y <= endCoords.y
		) {
			conflictingStitchings.push(stitching.stitchedBoardId);
		}
	};

	return conflictingStitchings;
};

BoardStitchingController.prototype.addStitching = function({ boardStitching }) {
	const stitchings = this.stitchingReference.getStitchingsListFromCoords({ coords });
	const conflictingStitchings = this.getConflictingStitchings({ stitchings, boardStitching });

	if (conflictingStitchings) { 
		throw new Error(conflictingStitchings);
	} else {


		CHANGE TO DISCREET METHOD ON StitchingReference
		stitchings.push(boardStitching);
	};
};

	ADD MEHTOD TO HANDLE RAW INPUT eg handle corners && sides in 1 INPUT


		CHANGE TO DISCREET METHOD ON StitchingReference
BoardStitchingController.prototype.removeStitching = function({ coords }) {
	const stitchings = this.stitchingReference.getStitchingsListFromCoords({ coords });
	const stitchingToBeRemoved = this.stitchingReference.getStitchingFromCoords({ coords });

	let stitchingRemovalIdx = null;

	stitchings.forEach((stitching, idx) => {
		if (stitching === stitchingToBeRemoved) {
			stitchingRemovalIdx = idx;
		}
	});

	if (!stitchingRemovalIdx) { return };

	stitchings.splice(stitchingRemovalIdx, 1)
};

BoardStitchingController.prototype.getStitching = function({ coords }) {
	return this.stitchingReference.getStitchingFromCoords({ coords });
};

export default BoardStitchingController;