function Stitch({
	stitchType,
	localBoardId,
	localBoardStartCoords, 
	localBoardEndCoords, 
	foreignBoardId,
	foreignBoardStartCoords,
	foreignBoardEndCoords,
}) {
	return {
		stitchType,
		localBoardId,
		localBoardStartCoords, 
		localBoardEndCoords, 
		foreignBoardId,
		foreignBoardStartCoords,
		foreignBoardEndCoords,
	}
};

function ZLevelStitchReference({ boardWidth, boardHeight }) {
	const reachableBoardWidth = boardWidth - 1;
	const reachableBoardHeight = boardHeight - 1;

	const stitchReference = {
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

	return stitchReference;
};

function BoardCoordData = function({ isSpaceAvailable, isSpaceValid, entity, foreignCoordData }) {
	return ({
		isSpaceAvailable,
		isSpaceValid,
		entity,
		foreignCoordData,
	});
};

export { Stitch, ZLevelStitchReference, BoardCoordData };