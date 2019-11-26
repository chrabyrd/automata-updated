export default function(jsModal) {
	const gridForm = document.querySelector('#grid-form');
	const unitSizeInput = document.querySelector('#unit-size');
	const widthRange = document.querySelector('#width-range');
	const widthNumberInput = document.querySelector('#width-number');
	const heightRange = document.querySelector('#height-range');
	const heightNumberInput = document.querySelector('#height-number');
	const createGridButton = document.querySelector('#create-grid-button');

	const maxDimension = 2000;  // Arbitrary
	unitSizeInput.max = maxDimension;

	gridForm.onsubmit = e => {
		e.preventDefault();  // prevent form submit

		jsModal.close();
		createGridData(e);
	};

	unitSizeInput.addEventListener('input', e => {
		const unitSize = e.target.value;

		[widthRange, widthNumberInput, heightRange, heightNumberInput].forEach(input => {
			updateDimensionInput({ 
				input, 
				unitSize, 
				maxValidDimension: getMaxValidDimension({
					unitSize,
					maxDimension,
				}),
			});
		});
	});

	widthRange.addEventListener('input', e => {
		widthNumberInput.value = e.target.value;
	});
	widthNumberInput.addEventListener('input', e => {
		widthRange.value = e.target.value;
	});

	heightRange.addEventListener('input', e => {
		heightNumberInput.value = e.target.value;
	});
	heightNumberInput.addEventListener('input', e => {
		heightRange.value = e.target.value;
	});
};

function getMaxValidDimension({ unitSize, maxDimension }) {
	let maxValidDimension;

	for (let i = maxDimension; i > 0; i--) {
		if (i % unitSize === 0) {
			maxValidDimension = i;
			break
		}
	}

	return maxValidDimension;
};

function updateDimensionInput({ input, unitSize, maxValidDimension }) {
	if (!unitSize) {
		input.disabled = true;
		input.value = null;
		return
	}

	input.disabled = false;

	input.step = unitSize;
	input.min = unitSize;
	input.max = maxValidDimension;

	let maxDimension;

	if (input.name.includes('width')) {
		maxDimension = window.innerWidth;
	}
	if (input.name.includes('height')) {
		maxDimension = window.innerHeight;
	}

	input.value = getMaxValidDimension({ unitSize, maxDimension });
};

function createGridData(e) {
	const formElements = e.target.elements;

	const gridDataEvent = new CustomEvent(
		'createGridData', 
		{ 
			detail: {
				unitSize: parseInt(formElements['unit-size'].value),
				width: parseInt(formElements['width'].value),
				height: parseInt(formElements['height'].value),
			},
		},
	);

	document.dispatchEvent(gridDataEvent);
}
