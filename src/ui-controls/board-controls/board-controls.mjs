import BoardDropdown from './board-dropdown.mjs';

function BoardControls() {
	this.container = document.createElement('div');

	this.boardDropdown = new BoardDropdown();
	// this.clearBoardButton = this._createClearBoardButton();

	// [this.clearBoardButton, this.boardDropdown].forEach(input => {
	// 	this.container.appendChild(input);
	// });
};

//  ( create, stitch, unstitch -- modal buttons ), destroy, reset to default state on list




// BoardControls.prototype._createClearBoardButton = function() {
// 	const clearBoardButton = document.createElement('button');
// 	clearBoardButton.innerHTML = "clear board";

// 	clearBoardButton.addEventListener('click', e => {
// 		e.preventDefault();

// 		const clearBoardEvent = new CustomEvent(
// 			'clearBoardAndDestroyEntities',
// 			{
// 				detail: {
// 					boardName: this.boardDropdown.value,
// 				},
// 			},
// 		);

// 		document.dispatchEvent(clearBoardEvent);
// 	});

// 	return clearBoardButton;
// };

// BoardControls.prototype._createFillBoardWithEntityTypeButton = function() {

// };

export default BoardControls;