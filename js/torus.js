//     File: torus.js
//     Synopsis: A Torus represents the grid underlying the game, including
//               methods to perform the rotations.
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

class Torus {
    constructor(anArray) {
        // A Torus object contains a 2D list (theArray),
        // which contains data (either integer, or ImgVal)
        // Store the dimensions of the data for convenience.
        // The 2D list is copied, so that each Torus has an
        // independent copy.

        // console.log("initializing theArray");
        // this.theArray = anArray;
        this.theArray = [];
        this.ROWS = anArray.length;
        this.COLS = anArray[0].length;

        // copy the data into theArray
        for (let row = 0; row < this.ROWS; row++) {
            const arow = [];
            for (let col = 0; col < this.COLS; col++) {
                arow.push(anArray[row][col]);
            }
            this.theArray.push(arow);
        }
        // console.log("done initializing theArray");
    }


    reset(anArray) {
        // restore the Torus to the given configuration
        // anArray could be the original configuration

        console.log("reset Torus " + this.ROWS + "x" + this.COLS);

        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                this.theArray[row][col] = anArray[row][col];
            }
        }

        // console.log("done reset Torus");
    }

    rotateRowLeft(row) {
        // rotate the given row to the left

        // console.log("rotating left" + row);
        let first = this.theArray[row][0];
        for (let i = 0; i < this.COLS - 1; i++) {
            this.theArray[row][i] = this.theArray[row][i + 1];
        }
        this.theArray[row][this.COLS - 1] = first;
    }

    rotateRowRight(row) {
        // rotate the given row to the right

        // console.log("rotating right" + row);
        let last = this.theArray[row][this.COLS - 1];
        for (let i = this.COLS - 1; i > 0; i--) {
            this.theArray[row][i] = this.theArray[row][i - 1];
        }
        this.theArray[row][0] = last;
    }

    rotateColUp(col) {
        // rotate the given column up

        // console.log("rotating up" + col);
        let first = this.theArray[0][col];
        for (let i = 0; i < this.ROWS - 1; i++) {
            this.theArray[i][col] = this.theArray[i + 1][col];
        }
        this.theArray[this.ROWS - 1][col] = first;
    }

    rotateColDown(col) {
        // rotate the given column down

        // console.log("rotating down" + col);
        let last = this.theArray[this.ROWS - 1][col];
        for (let i = this.ROWS - 1; i > 0; i--) {
            this.theArray[i][col] = this.theArray[i - 1][col];
        }
        this.theArray[0][col] = last;
    }

    valueAt(row, col) {
        // an accessor for the data value stored at the named row,col
        return this.theArray[row][col];
    }

    equalityTestF(other) {
        // Returns a function that compares this with other

        // console.log("creating equality test");
        const array1 = this.theArray;
        const array2 = other.theArray;
        const ROWS = array1.length;
        const COLS = array1[0].length;

        return function () {
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    if (array1[row][col] !== array2[row][col]) {
                        return false;
                    }
                }
            }

            return true;
        };
    }
}

