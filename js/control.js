//     File: control.js
//     Synopsis: The logic for interpreting the gestures either by a mouse or
//               by a touch screen.
//     Copyright (C) 2023-2024 Michael C Horsch
//
//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.
//
//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

// This file contains the logic for interpreting the gestures
// either by a mouse or by a touch screen.
// There is a subtle problem here.  The view must allow sliding,
// during which the tile images have "locations" that are between
// the states of the Toroid.  These have to be kept in sync.
// Currently, the View's location of the image tiles is set by the
// method "stopDragging()".  Ironically, the swipe() function does not
// know anything about view locations.

class Control extends Basecontrol {
    constructor(theLevel) {
        // This object contains all the control variables
        // for calculating the effects of the user's actions on the play-torus.
        super(theLevel);

        // a couple of attributes to record the starting XY coords for a mousedrag gesture
        this.swipeStartX = null;
        this.swipeStartY = null;

        // the logic is simpler if the event is treated as a path through a finite state graph
        // The drag even can only be horizontal or vertical, and these attributes identify
        // and constrain the event
        this.draggedX = 0;
        this.draggedY = 0;
        this.candragX = 1;
        this.candragY = 1;

        this.isDragging = false;
        this.draggingH = false;
        this.draggingV = false;

        // the minimum distance required for a swipe gesture
        this.SWIPE_THRESHOLD = 10;

        // remembers the cell where a drag/swipe started
        this.selectedCell = {
            row: -1,
            col: -1
        };

        // a stack for [UNDO]
        this.undoStack = [];

        // console.log("finished control constructor");

    }

    reset() {
        this.undoStack = [];
        this.animating = false;
    }



    undo() {
        // This function reverses the most recent swipe.
        // It depends on the appropriate action put into the undo stack

        if (this.undoStack.length === 0 || this.animating) {
            return;
        }
        this.animating = true;
        this.view.undoCounter();
        const undone = this.undoStack.pop();

        const action = undone.axis + undone.index;
        this.animateAction(action, this.animateTiles[action[0]]);

    }

    // mouse gestures

    startDraggingF() {
        // a higher order function to interpret the start of a dragging action
        const theController = this;
        return function (event) {
            // this function handles the call-back when a mousedown event is started

            // first, figure out if the mouse down event is within the torus
            // the padding on the canvas complicates matters a little
            // furthermore, the bounding rectangle changes if the canvas is occluded,
            // so it can't be precomputed.  I think.
            const rect = theController.view.canvas.getBoundingClientRect();
            const padding = 5; // this should be the value used in the CSS for torus-canvas
            const active = {
                top: rect.top + padding,
                left: rect.left + padding,
                right: rect.left + rect.width - padding,
                bottom: rect.top + rect.height - padding
            };
            // console.log("point: (" + event.clientX + ", " + event.clientY + ")");

            // only handle the event if the event starts in the active torus area
            if (event.clientX > active.left &&
                event.clientY > active.top &&
                event.clientX < active.right &&
                event.clientY < active.bottom) {
                theController.isDragging = true;
                theController.candragX = 1;
                theController.candragY = 1;

                theController.swipeStartX = event.clientX;
                theController.swipeStartY = event.clientY;
                theController.draggedX = event.clientX;
                theController.draggedY = event.clientY;

                theController.selectedCell.row = Math.floor((theController.swipeStartY - active.top) / theController.view.cellHeight);
                theController.selectedCell.col = Math.floor((theController.swipeStartX - active.left) / theController.view.cellWidth);
                // console.log("cell: (" + theController.selectedCell.row + ", " + theController.selectedCell.col + ")");

            }
        };
    }


    stopDraggingF() {
        // a higher order function to create a function for the call back when there is
        // a mouse up event.
        const theController = this;

        return function (event) {
            theController.isDragging = false;

            const swipeDistX = event.clientX - theController.swipeStartX;
            const swipeDistY = event.clientY - theController.swipeStartY;

            if (theController.draggingH) {
                theController.view.updateCounter();

                // horizontal swipe
                if (swipeDistX > 0) {
                    // right swipe
                    theController.swipe('R', theController.selectedCell.row);
                    const index = theController.selectedCell.row;
                    theController.undoStack.push({axis: "L", index: index});
                } else {
                    // left swipe
                    theController.swipe('L', theController.selectedCell.row);
                    const index = theController.selectedCell.row;
                    theController.undoStack.push({axis: "R", index: index});
                }
                // console.log(theController.undoStack);

                // correct the column that's being dragged
                for (let col = 0; col < theController.level.COLS; col++) {
                    theController.level.theTiles.valueAt(theController.selectedCell.row, col).setX(col * theController.view.cellWidth);
                }

            } else if (theController.draggingV) {
                theController.view.updateCounter();
                // vertical swipe
                if (swipeDistY > 0) {
                    // down swipe
                    theController.swipe('D', theController.selectedCell.col);
                    const index = theController.selectedCell.col;
                    theController.undoStack.push({axis: "U", index: index});
                } else {
                    // up swipe
                    theController.swipe('U', theController.selectedCell.col);
                    const index = theController.selectedCell.col;
                    theController.undoStack.push({axis: "D", index: index});
                }
                // console.log(theController.undoStack);

                // correct the row that's being dragged
                for (let row = 0; row < theController.level.ROWS; row++) {
                    theController.level.theTiles.valueAt(row, theController.selectedCell.col).setY(row * theController.view.cellHeight);
                }
            } else {
                // nothing!
            }
            theController.view.updateTable();
            theController.swipeStartX = null;
            theController.swipeStartY = null;
            theController.draggingH = false;
            theController.draggingV = false;
        };
    }


    updateDraggingF() {
        // a higher-order function to create a function when a mouse dragging event is registered
        const theController = this;

        return function (event) {
            // console.log("in updateDragging: " + event.clientX);
            // only allow dragging if it started using the startDragging function
            if (theController.isDragging) {
                // console.log("dragging");

                // the total distance since the drag started
                // The player may swipe past the one cell limit, so cap the distance swiped!
                const swipeDistXraw = event.clientX - theController.swipeStartX;
                const swipeDistX = Math.sign(swipeDistXraw) * Math.min(Math.abs(swipeDistXraw), theController.view.cellWidth);

                const swipeDistYraw = event.clientY - theController.swipeStartY;
                const swipeDistY = Math.sign(swipeDistYraw) * Math.min(Math.abs(swipeDistYraw), theController.view.cellHeight);

                // the change in distance since the last update, capped at zero if the user swiped more than one cell
                const deltaX = swipeDistX + theController.swipeStartX - theController.draggedX;
                const deltaY = swipeDistY + theController.swipeStartY - theController.draggedY;

                // figure out if the general dragging direction was mostly H or V
                // - it can't already be decided in a previous update
                // - it has to be more than a tiny nudge

                // figure out if the drag is mostly H
                if (!theController.draggingV
                    && theController.candragX > 0
                    && Math.abs(swipeDistX) > Math.abs(swipeDistY)
                    && Math.abs(swipeDistX) > theController.SWIPE_THRESHOLD) {

                    // the motion is mostly H, commit to it (preventing misinterpretation later)
                    theController.draggingH = true;
                    theController.candragY = 0;

                    // now animate the dragged tiles
                    for (let col = 0; col < theController.level.COLS; col++) {
                        let aTile = theController.level.theTiles.valueAt(theController.selectedCell.row, col);
                        aTile.updatePositionBy({x: deltaX, y: 0});
                    }
                    // make sure the displacement dragged is capped too
                    theController.draggedX = swipeDistX + theController.swipeStartX;
                    theController.draggedY = swipeDistY + theController.swipeStartY;
                    requestAnimationFrame(function () {
                        theController.view.updateTable();
                    });
                }
                // symmetric case for mostly V
                else if (!theController.draggingH
                    && theController.candragY > 0
                    && Math.abs(swipeDistY) >= Math.abs(swipeDistX)
                    && Math.abs(swipeDistY) > theController.SWIPE_THRESHOLD) {

                    // the motion is mostly V, commit to it (preventing misinterpretation later)
                    theController.draggingV = true;
                    theController.candragX = 0;

                    // now animate the dragged tiles
                    for (let row = 0; row < theController.level.ROWS; row++) {
                        let aTile = theController.level.theTiles.valueAt(row, theController.selectedCell.col);
                        aTile.updatePositionBy({y: deltaY, x: 0});
                    }
                    // make sure the displacement dragged is capped too
                    theController.draggedX = swipeDistX + theController.swipeStartX;
                    theController.draggedY = swipeDistY + theController.swipeStartY;
                    requestAnimationFrame(function () {
                        theController.view.updateTable();
                    });
                }
                // could be an ambiguous swipe, so do nothing until it's clearer!

            }
        };
    }

    // touch gestures
    // convert touch gestures into mouse gestures, to reuse the above mouse event methods

    handleTouchEventF(mttype, gettouch) {
        const eventTarget = this.view.canvas;

        return function (event) {
            event.preventDefault();
            const touch = gettouch(event);
            const mouseEvent = new MouseEvent(mttype, {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            eventTarget.dispatchEvent(mouseEvent);
        };
    }

    handleTouchStartF() {
        return this.handleTouchEventF('mousedown',
                                     function(event) {return event.touches[0];});
    }

    handleTouchMoveF() {
        return this.handleTouchEventF('mousemove',
                                     function(event) {return event.touches[0];});
    }

    handleTouchEndF() {
        return this.handleTouchEventF('mouseup',
                                     function(event) {return event.changedTouches[0];});
    }

}