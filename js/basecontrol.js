//     File: basecontrol.js
//     Synopsis: A base class for Control and ReplayControl.
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

class Basecontrol {
    constructor(theLevel) {

        // these get set in makeConnect()
        this.level = theLevel;
        this.view = null;
        this.max_slide_time = 1000;
        this.slide_time = this.max_slide_time / 10;
        this.animating = false;
        this.animateTiles = {
            'U': this.__colDrawF(-1),
            'D': this.__colDrawF(1),
            'L': this.__rowDrawF(-1),
            'R': this.__rowDrawF(1)
        };
        // console.log("finished base control constructor");
    }

    makeConnect(theView) {
        // connect the components together
        this.view = theView;
    }

    swipe(axis, index) {
        // this method contains the details about how rotations happen

        switch (axis) {
            case "U":
                this.level.theTiles.rotateColUp(index);
                this.level.theTorus.rotateColUp(index);
                break;
            case "D":
                this.level.theTiles.rotateColDown(index);
                this.level.theTorus.rotateColDown(index);
                break;
            case "L":
                this.level.theTiles.rotateRowLeft(index);
                this.level.theTorus.rotateRowLeft(index);
                break;
            case "R":
                this.level.theTiles.rotateRowRight(index);
                this.level.theTorus.rotateRowRight(index);
                break;
            default:
                console.log("impossible axis");
        }
    }

    animateAction(action, rowcolDrawf) {
        // one function to animate the given action using the given draw function
        const self = this;
        const start = performance.now();

        requestAnimationFrame(function animate(time) {
            // this function is indirectly recursive
            // timeFraction goes from 0 to 1
            let timeFraction = (time - start) / self.slide_time;
            if (timeFraction > 1) {
                // if for any reason, we got delayed, act as if we just got to the end
                timeFraction = 1;
            }

            // animate the up/down or left/right
            rowcolDrawf(timeFraction, action);
            if (timeFraction < 1) {
                // still more to do
                requestAnimationFrame(animate);
            }
            else {
                // when the animation is over
                self.animating = false;
                // set the logical positions last
                self.swipe(action[0], parseInt(action[1]));
                // show the whole torus
                requestAnimationFrame(function () {self.view.updateTable()});
            }
        });
    }

    __colDrawF (forward) {
        const self = this;
        return function(tf, action) {
            const new_y = forward * tf * self.view.cellHeight;
            for (let row = 0; row < self.level.ROWS; row++) {
                const tile = self.level.theTiles.valueAt(row, action[1]);
                tile.setY(row * self.view.cellHeight + new_y);
                tile.draw(self.view.ctx, false);
            }
        };
    }

    __rowDrawF (forward) {
        const self = this;
        return function (tf, action) {
            const new_x = forward * tf * self.view.cellWidth;
            for (let col = 0; col < self.level.COLS; col++) {
                const tile = self.level.theTiles.valueAt(action[1], col);
                tile.setX(col * self.view.cellWidth + new_x);
                tile.draw(self.view.ctx, false);
            }
        };
    }
}