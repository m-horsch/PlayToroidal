//     File: arrayutils.js
//     Synopsis: Some nice functions for Rotators, but not currently used.
//               A future update path.
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

// TODO: These nice Rotator functions are not currently being used!
function leftRotator(theArray) {
    "use strict";
    const COLS = theArray[0].length;

    return function (row) {
        // rotate the given row to the left

        let first = theArray[row][0];
        for (let i = 0; i < COLS - 1; i++) {
            theArray[row][i] = theArray[row][i + 1];
        }
        theArray[row][COLS - 1] = first;
    };
}

function rightRotator(theArray) {
    "use strict";
    const COLS = theArray[0].length;
    return function (row) {
        // rotate the given row to the right

        let last = theArray[row][COLS - 1];
        for (let i = COLS - 1; i > 0; i--) {
            theArray[row][i] = theArray[row][i - 1];
        }
        theArray[row][0] = last;
    };
}

function upRotator(theArray) {
    "use strict";
    const ROWS = theArray.length;
    return function (col) {
        // rotate the given column up

        let first = theArray[0][col];
        for (let i = 0; i < ROWS - 1; i++) {
            theArray[i][col] = theArray[i + 1][col];
        }
        theArray[ROWS - 1][col] = first;
    };
}


function downRotator(theArray) {
    "use strict";
    const ROWS = theArray.length;
    return function (col) {
        // rotate the given column up

        let last = theArray[ROWS - 1][col];
        for (let i = ROWS - 1; i > 0; i--) {
            theArray[i][col] = theArray[i - 1][col];
        }
        theArray[0][col] = last;
    };
}



