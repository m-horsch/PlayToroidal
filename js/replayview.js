//     File: replayview.js
//     Synopsis: A ReplayView contains the information and technology to present
//     the recorded replay to the viewer.
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

class ReplayView extends Baseview {
    constructor(theLevel) {
        // This object is the View in MVC.  It contains the information
        // and technology to present the game to the player.

        super(theLevel);

        // done only once
        // stuff that is created by the HTML doc
        // where to display how many moves have been made so far
        this.moveElement = document.getElementById("counter");

        // some initialization is shared with reset; these are located here
        this.initialize();

        // console.log("finished replayview constructor");
    }

    // Called in the constructor, and also on [Reset]
    initialize() {
        // This method initializes some data, but can be reused when
        // the user hits [Reset].

        // console.log("starting initialize for view");

        // count the number of moves and display it on the page
        this.moveCounter = 0;
        this.moveElement.innerText = "" + this.moveCounter;

        // console.log("finished initialize for view");
    }

    reset() {
        // TO be executed when the user hits [Reset]

        console.log("starting reset for replayview");

        this.initialize();
        this.updateTable();
        // console.log("finished reset for replayview");
    }


    updateTable() {
        // this method forces a re-draw for the play-torus

        // console.log("Updating table");
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let row = 0; row < this.theLevel.ROWS; row++) {
            for (let col = 0; col < this.theLevel.COLS; col++) {
                this.theLevel.theTiles.valueAt(row, col).setX(col * this.cellWidth);
                this.theLevel.theTiles.valueAt(row, col).setY(row * this.cellHeight);
                // the draw method might, in future, highlight tiles that are currently in the right place
                // but for now, the second parameter is ignored
                // console.log("Updating table at " + row +", " + col);
                // const hilight = (this.theLevel.theGoalTorus.valueAt(row, col) === this.theLevel.theTorus.valueAt(row, col));
                const hilight = false;
                this.theLevel.theTiles.valueAt(row, col).draw(this.ctx, hilight);
            }
        }
        this.ctx.restore();
    }


    modifyCounter(by) {
        // display the current number of moves on the HTML

        this.moveCounter += by;
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


}

