function createMainCanvas({ containerId, canvasId, parent, width, height }) {
  let divWrapper = document.createElement('div');
  let canvasElem = document.createElement('canvas');

  parent.appendChild(divWrapper);
  divWrapper.appendChild(canvasElem);

  divWrapper.id = containerId;
  canvasElem.id = canvasId;
  canvasElem.width = width;
  canvasElem.height = height;

  let ctx = canvasElem.getContext('2d');

  return {
    ctx: ctx,
    id: containerId
  };
}

export default createMainCanvas;