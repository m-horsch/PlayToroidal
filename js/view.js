//     File: view.js
//     Synopsis: A View contains the information and technology to present
//     the game to the player.
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

// This object is the View in MVC.  It contains the information
// and technology to present the game to the player.


class View extends Baseview {
    constructor(theLevel) {

        super(theLevel);

        // done only once
        // stuff that is created by the HTML doc
        // where to display how many moves have been made so far
        this.moveElement = document.getElementById("counter");

        // where to display the time used so far
        this.timeElement = document.getElementById("timer");

        // some initialization is shared with reset; these are located here
        this.initialize();

        // console.log("finished view constructor");
    }

// Called in the constructor, and also on [Reset]
    initialize() {
        // This method initializes some data, but can be reused when
        // the user hits [Reset].
        "use strict";

        // console.log("starting initialize for view");

        // could be reset more than once
        this.nexted = false; // controls the [Next] button in puzzle sequences
        this.undoned = false; // controls the [Undo] button in puzzle sequences

        // count the number of moves and display it on the page
        this.moveCounter = 0;
        this.moveElement.innerText = "" + this.moveCounter;
        this.timeCounter = 0;
        this.timeElement.innerText = "" + this.timeCounter;

        // dynamic features involving callbacks
        // a local name for the object, to embed in callbacks
        const self = this;

        // set the timer visualiation running
        if (!this.timer || this.nexted) {
            this.timer = setInterval(function () {
                self.updateTimer();
            }, 1000);
        }

        // a weird object to show progress in various ways, e.g., # steps so far
        this.monitor = new ProgressMonitor(this.theLevel.rating);

        if (this.theLevel.blurb) {
            // any blurb added to the JSON file gets priority over the default
            // console.log("got blurb from level");
            document.getElementById("win").innerText = this.theLevel.blurb;
        } else {
            // no blurb, set the challenge
            document.getElementById("win").innerText
                = "Solve the puzzle in {0} moves to achieve gold rating.".format("" + this.theLevel.rating.gold);
        }
        // console.log("finished initialize for view");
    }

    reset() {
        // TO be executed when the user hits [Reset]

        // console.log("starting reset for view");
        if (this.nexted) {
            // console.log("trying to remove next");
            document.getElementById("next").remove();
        }
        if (this.undoned) {
            // console.log("trying to remove undo");
            document.getElementById("undo").remove();
        }

        this.initialize();
        this.updateTable();
        // console.log("finished reset for view");
    }

    makeConnect(theController) {
        // called to connect the View to theController

        // console.log("starting view makeConnect");
        super.makeConnect(theController);

        // add all the mouse listeners
        // The user actions are defined in control.js
        this.canvas.addEventListener("mousedown", this.theController.startDraggingF());
        this.canvas.addEventListener("mousemove", this.theController.updateDraggingF());
        this.canvas.addEventListener("mouseup", this.theController.stopDraggingF());

        const self = this;
        const do_undo = function () {
            self.theController.undo();
            return false;
        };

        this.canvas.addEventListener("mouseup",
            function (event) {

                if (!self.undoned && self.theController.undoStack.length > 0) {
                    self.undoned = true;
                    const undoops = document.createElement("a");
                    undoops.setAttribute("class", "restart-button");
                    undoops.setAttribute("id", "undo");
                    undoops.innerHTML = 'Undo';
                    undoops.onclick = do_undo;

                    document.getElementById("options").appendChild(undoops);
                }
            });

        // if the drag event goes outside the play torus, consider it the end of the dragging
        this.canvas.addEventListener("mouseleave", function (event) {
            if (self.theController.isDragging) {
                // Create and dispatch a mouseup event, because it's essentially what's happened
                const mouseEvent = new MouseEvent('mouseup', {
                    clientX: event.clientX,
                    clientY: event.clientY
                });
                theController.view.canvas.dispatchEvent(mouseEvent);
            }
        });


        // when the user stops dragging, check if the game is over, and if so
        // do end of game view things
        this.canvas.addEventListener("mouseup", function (event) {
            if (self.theLevel.goalStateReached()) {
                clearInterval(self.timer);
                document.getElementById("win").innerText
                    = "Solved in {0} moves.".format("" + self.moveCounter);
                if (self.theLevel.nextPage && !self.nexted) {
                    self.nexted = true;
                    const nextops = document.createElement("a");
                    nextops.setAttribute("class", "restart-button");
                    nextops.setAttribute("id", "next");
                    nextops.innerHTML = 'Next';
                    nextops.onclick = function () {
                        // document.location = "Toroidal.html?mode=" + self.theLevel.nextPage + ".json";
                        document.location = "Toroidal.html";
                        return false;
                    };

                    document.getElementById("options").appendChild(nextops);
                }
            }
        });


        // Add touch event listeners to the target element
        // The touch handlers translate the touches into mouse events
        // handled by the mouse event handlers.
        this.canvas.addEventListener('touchstart', this.theController.handleTouchStartF());
        this.canvas.addEventListener('touchmove', this.theController.handleTouchMoveF());
        this.canvas.addEventListener('touchend', this.theController.handleTouchEndF());
    }


    updateTable() {
        // this method forces a redraw for the play-torus

        // console.log("Updating table");
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        for (let row = 0; row < this.theLevel.ROWS; row++) {
            for (let col = 0; col < this.theLevel.COLS; col++) {
                // the draw method might, in future, highlight tiles that are currently in the right place
                // but for now, the second parameter is ignored
                // console.log("Updating table at " + row +", " + col);
                this.theLevel.theTiles.valueAt(row, col).draw(this.ctx,
                    this.theLevel.theGoalTorus.valueAt(row, col) === this.theLevel.theTorus.valueAt(row, col));
            }
        }
        this.ctx.restore();
    }


    modifyCounter(by) {
        // display the current number of moves on the HTML

        this.moveCounter += by;
        const colour = "color: " + this.monitor.interpolate(this.moveCounter);
        this.moveElement.setAttribute('style', colour);
        this.moveElement.innerText = "" + this.moveCounter;
    }

    updateCounter() {
        // display the current number of moves on the HTML
        this.modifyCounter(+1);
    }


    undoCounter() {
        // display the current number of moves on the HTML
        this.modifyCounter(-1);
    }

    updateTimer() {
        // display the current time used on the HTML
        this.timeCounter += 1;
        this.timeElement.innerText = "" + formatTime(this.timeCounter);
    }



}

