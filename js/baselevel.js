//     File: baselevel.js
//     Synopsis: A base class for PlayLevel and ReplayLevel.  A Baselevel
//               represents all the details for a particular puzzle.
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

// TODO: store and retrieve statistics for each puzzle
// TODO: display "personal bests"
// TODO: revise puzzle file structure so that puzzles are indexed
// TODO: highlight tiles that are in the right place
// TODO: Crossword puzzles, possibly without any "goal" showing; the problem is to figure out the words!

class Baselevel {
    constructor(details) {
        /*
        A Baselevel represents all the details for a particular puzzle.  It's the model in MVC.
        It's a bit redundant, as most of these details are in the given JSON object.
        This object contains the data defined in the JSON files.
        It also stores the two Torus objects for the start and end states, and various other
        data.
         */

        // console.log("starting level constructor");
        this.ROWS = details.rows;
        this.COLS = details.cols;
        this.initial = details.initial;

        // initialize the goal torus, with a 2D array of integers
        // this is the end state
        //   the integers have to be the same as in the startArray,
        //   though they should be in a different order
        this.theGoalTorus = new Torus(details.final);

        // initialize the state torus, with a 2D array of integers
        // this is the start state
        //   the integers have to be the same as in the goalArray,
        //   though they should be in a different order

        this.theTorus = new Torus(details.initial);

        // The tile images are stored here,
        // but initialized in methods loadTileImages, makeTiles
        // console.log("details.imagetiles " + details.imagetiles);
        // console.log("details.ntiles " + details.ntiles);
        this.tilesPathDict = details.imagetiles; // a dictionary that describes the location of the tile images
        this.ntiles = details.ntiles;
        this.theImagesRaw = []; // store the smaller images
        this.theTiles = [];     // the torus of smaller images displayed as the puzzle

        // console.log("finished base level constructor");
    }


    loadTileImages(drawWithTiles) {
        // load the tile images from the server
        // puts the images in a list, called theImagesRaw
        // the image's index is the order that the image appears
        // in the theImagesRaw, which must be the same as tilesPathDict

        // console.log("loading tile images");
        // console.log("ntiles: " + this.ntiles);

        // ImagesLoaded strategy taken from
        // https://stackoverflow.com/questions/3032299/checking-for-multiple-images-loaded
        // which also had a Promises strategy.

        var imagesLoaded = 0;
        const self = this;
        for (let val = 0; val < this.ntiles; val++) {
            const img = new Image(); // create new image object
            img.src = this.tilesPathDict[val];
            // console.log("tile img.src: " + img.src);
            this.theImagesRaw.push(img);
            img.onload = function() {
                imagesLoaded++;
                if (imagesLoaded === self.ntiles) {
                    // drawWithTiles() should do all drawing needed.
                    // see BaseView.makeConnect()
                    drawWithTiles();
                }
            };
        }
    }

    tileInPlace(row, col, imgn) {
        // return true iff the tile at row,col is in the correct place
        // according to the goalArray
        return this.theTiles.theArray[row][col]._img.src === this.theImagesRaw[imgn].src;
    }


// auxiliary method to assist in creating theTiles
    makeTiles(cellW, cellH, theCTX) {
        // should only be called after the tiles are loaded.
        // see loadTileIMages() and baseview.makeconnect
        // create a Tile object for each image tile in theImagesRaw
        // arguments are needed to ensure the images are displayed
        // correctly

        // console.log("in level.makeTiles");
        this.theTilesRaw = [];
        for (let row = 0; row < this.ROWS; row++) {
            const theRow = [];
            for (let col = 0; col < this.COLS; col++) {
                // console.log("creating tile at " + col + ", " + row);
                const atile = new Tile({x: col * cellW, y: row * cellH},
                    {x: this.COLS * cellW, y: this.ROWS * cellH},
                    this.theImagesRaw[this.theTorus.valueAt(row, col)],
                    {w: cellW, h: cellH});
                theRow.push(atile);
            }
            this.theTilesRaw.push(theRow);
        }

        // now put the tiles into a torus, too
        this.theTiles = new ImgTorus(this.theTilesRaw);

        // for each image, draw it in its place in the canvas
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.theTiles.theArray[row][col].draw(theCTX, false);
            }
        }
    }


    reset(cellW, cellH) {
        // console.log("reset Playlevel");
        // reset the torus for tile numbers
        // console.log("resetting theTorus");
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.theTorus.theArray[row][col] = this.initial[row][col];
                this.theTiles.theArray[row][col] = this.theTilesRaw[row][col];
                this.theTiles.theArray[row][col].setX(col * cellW);
                this.theTiles.theArray[row][col].setY(row * cellH);
            }
        }

    }
}