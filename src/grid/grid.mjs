import UserInputLayer from './UserInputLayer.mjs';
import DrawOutLayer from './DrawOutLayer.mjs';
import Entity from '../entity/entity.mjs';


function Grid ({ minUnitSize, width, height }) {
  this.container = document.createElement('div');
  this.container.style.width = `${width}px`;
  this.container.style.height = `${height}px`;
  this.container.style.border = '5px solid red';
  console.log(this.container)

  this.minUnitSize = minUnitSize;

  this.width = width;
  this.height = height;

  this.maxReachableWidth = (this.width / this.minUnitSize) - 1;
  this.maxReachableHeight = (this.height / this.minUnitSize) - 1;

  this.userInputLayer = new UserInputLayer({ width, height, minUnitSize });
  this.drawOutLayer = new DrawOutLayer({ width, height, minUnitSize });

  this.pendingUpdates = {};

  this.container.appendChild(this.userInputLayer.canvas);
  this.container.appendChild(this.drawOutLayer.canvas);
};

Grid.prototype.update = function() {
  this.drawOutLayer.update({ pendingUpdates: this.pendingUpdates });
  this.pendingUpdates = {};
};

Grid.prototype.clear = function() {
  this.pendingUpdates = {};
  this.drawOutLayer.clear();
};  

Grid.prototype.getMouseCoords = function() {
  return this._convertAbsoluteCoordsToRelative({
    absoluteCoords: this.userInputLayer.mouseHoverUnit,
  });
};

Grid.prototype.areCoordsValid = function({ coords }) {
  return (
    coords.x >= 0 
    && coords.x <= this.maxReachableWidth
    && coords.y >= 0 
    && coords.y <= this.maxReachableHeight
  );
};

Grid.prototype.removeFromDocument = function() {
  this.container.remove();
};

Grid.prototype.addPendingUpdate = function({ coords, color }) {
  const absoluteCoords = this._convertRelativeCoordsToAbsolute({ relativeCoords: coords });
  const pendingUpdateKey = [absoluteCoords.x, absoluteCoords.y];

  if (color && this.pendingUpdates[pendingUpdateKey]) {
    throw new Error('Entity conflict in pendingUpdates');
  };

  this.pendingUpdates[pendingUpdateKey] = {
    coords: absoluteCoords,
    color,
  };
};

Grid.prototype._convertAbsoluteCoordsToRelative = function({ absoluteCoords }) {
  return {
    x: absoluteCoords.x / this.minUnitSize,
    y: absoluteCoords.y / this.minUnitSize,
  };
};

Grid.prototype._convertRelativeCoordsToAbsolute = function({ relativeCoords }) {
  return {
    x: relativeCoords.x * this.minUnitSize,
    y: relativeCoords.y * this.minUnitSize,
  };
};

export default Grid;