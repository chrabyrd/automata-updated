function createMainCanvas({ canvasId, parent, width, height }) {
  let container = document.querySelector('#canvas-container');
  let canvas = document.createElement('canvas');

  container.appendChild(canvas);

  canvas.id = canvasId;
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext('2d');

  return { ctx };
}

export default createMainCanvas;