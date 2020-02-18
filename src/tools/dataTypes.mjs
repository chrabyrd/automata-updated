function Stitch({
	localBoardId,
	localBoardStartCoords, 
	localBoardEndCoords, 
	foreignBoardId,
	foreignBoardStartCoords,
	foreignBoardEndCoords,
}) {
	return {
		localBoardId,
		localBoardStartCoords, 
		localBoardEndCoords, 
		foreignBoardId,
		foreignBoardStartCoords,
		foreignBoardEndCoords,
	}
};

function ZLevelStitchReference({ relativeBoardWidth, relativeBoardHeight }) {
	const reachableBoardWidth = relativeBoardWidth - 1;
	const reachableBoardHeight = relativeBoardHeight - 1;

	const stitchReference = {
		// on-board (non-current-z only)
		[[reachableBoardWidth, reachableBoardHeight]]: [],
		// top
		[[reachableBoardWidth, -1]]: [],
		// right
		[[relativeBoardWidth, reachableBoardHeight]]: [],
		// bottom
		[[reachableBoardWidth, relativeBoardHeight]]: [],
		// left
		[[-1, reachableBoardHeight]]: [],
		// top-left-corner
		[[-1, -1]]: [],
		// top-right-corner
		[[relativeBoardWidth, -1]]: [],
		// bottom-right-corner
		[[relativeBoardWidth, relativeBoardHeight]]: [],
		// bottom-left-corner
		[[-1, relativeBoardHeight]]: [],
	};

	return stitchReference;
};

function CoordData({ boardId, coords, entity, isSpaceAvailable, isSpaceValid }) {
	return ({
    boardId: null,
    coords: null,
    entity: null,
    isSpaceAvailable: false,
    isSpaceValid: false,
  });
};

export { Stitch, ZLevelStitchReference, CoordData };