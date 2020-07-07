# Automata

## CAUTION: HERE BE DRAGONS!

This is PRE-ALPHA, and still in active development. Nothing has been cleaned, nothing has been tested. If you're here it's probably because I'd like to show you something interesting; please mind the mess :-)

### main.mjs

This is the top-level file. It will eventually be used to call two things: the Automata engine and the complementary UI.

Right now it's being used as an abstraction of user input. Essentially it's loading the engine and using events to simulate the creation of a Board, entityData, and Clock.

## Concept

### Overview

Automata is a cellular automation engine with flexibility in mind. Under the hood it's using HTML canvases and a homebrewed grid-and-stitch system to represent independent 1-D, 2-D, and 3-D space. The user can define their own entities and entity behavior, and watch in real-time as they interact with one another.

### Self-contained

This is 100% dependency-less vanilla JS ( not counting mocha/chai testing frameworks ), and that will never change. The point is to create something entirely self-contained.

The interesting downside of being dependency-less is that Babel hasn't been installed. This app is built in ES6, and needs to be transpiled to ES5 to be "entirely self-contained." I'm saving that for alpha; for now the app will run in a minimal express environment. I use [reload](https://www.npmjs.com/package/reload).

### Flexible

Bundled canvas elements ( known as Boards/Grids ) exist in independent 3-D space. The user can attach cells, corners, and edges as they like.

Entities ( the abstraction of each Grid cell ) can have any state, actions, and update logic the user pleases.

Clocks control the iteration of grid updates. Clocks can control one or many grids. They can even control other clocks!

## Broad Strokes from the top-down

### `Automaton` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/automaton/Automaton.mjs)

This is the automation engine. I think of him has the "man behind the curtain," it has the most knowledge of the app. It should therefore only be used for high-level functions. Only one can exist in any given instance. This causes some minor confusion with the package name being the plurality. Because of their complexity, the Automaton is responsible for all Entity CRUD actions.

### Controllers

If the Automaton is the "man behind the curtain," then the controllers can be thought of as his high-ranking minions. There can be only one instance of each, and each has knowledge and control over all resources in their domain.

#### `BoardController` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/boardController/BoardController.mjs)

It is possible for the Automaton to have many boards, and for the boards to exist either independently of one another or be tightly coupled. To compartmentalize the CRUD and stitching functionality of Boards, the BoardController was created.

#### `EntityController` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/entityController/EntityController.mjs)

Entities are the abstractions of Grid cells, and the state they maintain between canvas renders. They can be simple or _very_ complex. The EntityController was created to handle the CRUD and higher-level entity actions in the application.

#### `ClockController` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/clockController/ClockController.mjs)

The Automaton can have many Clocks. Clocks control the iteration of Boards. They are complex objects, and Clocks have the ability to control the ticking of other Clocks. To handle CRUD actions and this inter-clock functionality, the ClockController was created.

### Resources

The Automaton has direct control over each ( singleton ) Controller. Each Controller has control over their direct resources, but shouldn't have control over their sub-resources. 

For example: Boards are a level of abstraction over Grids, which are a bundling of a UserInputLayer and a DrawOutLayer. The BoardController should access the methods on `Board`, but not the methods on the lower `Grid`s or Canvas layers.

#### `Board` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/board/Board.mjs)

The `Board` object is a combination of a `Grid` and a `StitchReference`. It is a higher-level object, and it's being used as both a stepping function to update `Grid` with new data, keep track of local `Entity` locations, and maintain a reference of other connected `Boards`.

##### `Grid` [(link)](https://github.com/chrabyrd/automata-updated/tree/master/src/grid)

The `Grid` is a combination of two layers: the `UserInputLayer` and the `DrawOutLayer`. It exists to communicate between the two.

###### `UserInputLayer`

An HTML Canvas element that will consistently draw a box around the mousehover cell.

###### `DrawOutLayer`

An HTML Canvas element that renders new information each associated `Clock` tick.

##### `StitchReference` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/tools/StitchReference.mjs)

The `StitchReference` is what allows the `Board` objects to have relations to one another. They're broken into three z-levels, and extend 1 space beyond the `Board`'s borders. Each `Stitch` creates a one-way connection to another board, that can then be mirrored to create 2-way connections.

#### `Entity` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/entity/Entity.mjs)

Entities are abstractions of `Grid` cells. It is the lowest level of information that can exist on a `Board`. Everything that exists on a `Board` inherits from an `Entity`. Entities are independent, and know only about their neighbors and internal workings. 

User-defined objects (eg 'sheep', 'grass', or 'ChessPiece') should inherit this class and pass in their own image, state, actions, and update logic.

#### `Clock` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/clock/Clock.mjs)

On creation, `Clocks` are bound to one or many `Boards` and one or many other `Clocks`. They are used to begin, progress, and end `Board` iterations.

#### `Compendium` [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/compendium/Compendium.mjs)

The `Compendium` is a simple, useful dictionary tool for interacting with `Symbol`-id based objects.

## Points of Interest

* Automaton.mjs is getting fat, but how to gracefully split? [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/automaton/Automaton.mjs)

* Making 2d-infinite boards is common enough to warrant a creation flag, but it's ~100 lines [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/boardController/BoardController.mjs#L179)

* FUN behavior with state and entities [(link_1)](https://github.com/chrabyrd/automata-updated/blob/master/src/entity/Entity.mjs#L22) [(link_2)](https://github.com/chrabyrd/automata-updated/blob/master/src/entityController/EntityController.mjs#L19)

* Render flow [(link)](https://github.com/chrabyrd/automata-updated/blob/master/src/automaton/Automaton.mjs#L108): 

    * A `Clock` ticks, signaling the `Automaton` to begin updating the associated `Boards`

    * The `Automaton` asks the `BoardController` to get all `Entity` ids associated with the `Boards`, then shuffles them

    * For each `Entity` id, the `Automaton` asks the `EntityController` to get a valid update based on the `Entity`'s logic and the ( `Automaton`-supplied ) current neighborhood.

    * After obtaining the list of requested updates, the `Automaton` asks the `EntityController` to complete each update in succession. 

    * After all updates have completed in the `EntityController`, the `Automaton` gathers the updated `Board` data, and passes it to the `BoardController`.

    * The `BoardController` then updates the affected boards.

## Future plans

* UI ( literally all of it )
* Improve the render logic

    * OpenGL

    * Offloading heavy lifting to WebWorkers

    * Updating the canvas via ImageData

* Local saving
* Pixelmaps