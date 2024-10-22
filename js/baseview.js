//     File: baseview.js
//     Synopsis: A base class for View and ReplayView.  The BaseView is
//               responsible for the play canvas, and the goal canvas
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

// the baseview is responsible for the play canvas, and the goal canvas
class Baseview {
    constructor(theLevel) {
        // This object is the View in MVC.  It contains the information
        // and technology to present the game to the player.

        // done only once

        this.theLevel = theLevel;
        this.theController = null; // will be connected later

        // a canvas for the goal copy of the image, so the user knows what they're trying to solve
        this.goalcanvas = document.getElementById('goal-canvas');
        this.gctx = this.goalcanvas.getContext('2d');

        // a canvas for the main game
        this.canvas = document.getElementById('torus-canvas');
        this.ctx = this.canvas.getContext('2d');

        // cell size constants
        // cell size adjustment for replay
        const min_dim = 300; // 3x3 or smaller
        const max_dim = 500; // 10x10 or bigger
        const maxrowcol = Math.max(theLevel.ROWS,theLevel.COLS);
        var dim;
        if (maxrowcol <= 3) {
            dim = min_dim/maxrowcol;
        }
        else if (maxrowcol >= 10) {
            dim = max_dim/maxrowcol;
        }
        else {
            // a linear proportion of the max size
            const fulldim = min_dim + (max_dim - min_dim)*(maxrowcol-3)/7;
            dim = fulldim / maxrowcol;
        }
        dim = Math.floor(dim);
        this.cellWidth = dim;
        this.cellHeight = dim;

        // console.log("finished baseview constructor");
    }

// Called in the constructor, and also on [Reset]

    makeConnect(theController) {
        // called to connect the View to theController

        // console.log("starting baseview makeConnect");
        this.theController = theController;

        this.canvas.width = this.cellWidth * this.theLevel.COLS;
        this.canvas.height = this.cellHeight * this.theLevel.ROWS;
        this.goalcanvas.width = this.canvas.width;
        this.goalcanvas.height = this.canvas.height;

        const self = this;

        // load and configure the tiles
        this.theLevel.loadTileImages(function() {
            self.drawGoal();
            self.theLevel.makeTiles(self.cellWidth, self.cellHeight, self.ctx);
        });

    }

    // draw the image in the given canvas graphics context

    drawGoal() {
        // a method to draw the goal torus on the HTML page
        // this implementation uses the tiles, making the
        // goal image unnecessary
        // console.log("in level.drawGoal");
        // console.log(this.goalImage.src);

        this.gctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.gctx.save();

        for (let row = 0; row < this.theLevel.ROWS; row++) {
            for (let col = 0; col < this.theLevel.COLS; col++) {
                const tile_img_number = this.theLevel.theGoalTorus.valueAt(row, col);
                const tile_img = this.theLevel.theImagesRaw[tile_img_number];
                const tile_x = col * this.cellWidth;
                const tile_y = row * this.cellHeight;
                this.gctx.drawImage(tile_img, 0, 0, tile_img.width, tile_img.height,
                    tile_x, tile_y, this.cellWidth, this.cellHeight);
                // to check that the goal image is being constructed here,
                // I have highlighting drawn.  May be useful for debugging in the future
                // this.gctx.strokeStyle = '#ff006a';
                // this.gctx.strokeRect(tile_x, tile_y, this.cellWidth, this.cellHeight);
            }
        }

        this.gctx.restore();
    }

}

