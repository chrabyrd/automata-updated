
function BoardDropdown() {
	this.dropdown = document.createElement('select');

	this.boardNames = [];

	document.addEventListener('createBoard', e => this.addBoardToMenu({ boardName: e.detail.name }));
	document.addEventListener('destroyBoard', e => this.removeBoardFromMenu({ ...e.detail }));

	return this.dropdown;
};

BoardDropdown.prototype.addBoardToMenu = function({ boardName }) {
	this.boardNames.push(boardName);
	this._updateMenu();
};

BoardDropdown.prototype.removeBoardFromMenu = function({ boardName }) {
	this.boardNames = boardNames.filter(boardName);
	this._updateMenu();
};

BoardDropdown.prototype._updateMenu = function() {
	const createOption = boardName => {
		const option = document.createElement('option');

		option.value = boardName;
		option.appendChild(document.createTextNode(boardName));

		this.dropdown.appendChild(option);
	};

	this.dropdown.innerHTML = "";

	createOption("");

	for (const boardName of this.boardNames) { createOption(boardName) };
};

export default BoardDropdown;