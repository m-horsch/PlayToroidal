//     File: progressMonitor.js
//     Synopsis: Object to report and update performance (moves, time) on the page.
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

class ProgressMonitor {
    constructor(given) {
        // this object allows conversion of a numeric (integer) value to
        // an HTML property (color) based on a given rating scheme.
        // the rating scheme here is a dictionary with keys
        // gold silve bronze.
        // the interpolate() method returns the key for a given integer value

        this.rating = given || {"gold": 10, "silver": 20, "bronze": 30};
        this.table = [
            {right: this.rating.gold, value: 'gold'},
            {right: this.rating.silver, value: 'silver'},
            {right: this.rating.bronze, value: '#CD7F32'}, // bronze
            {right: null, value: '#dad9d7'}, // whitish
        ];
    }

    interpolate(value) {
        // return the key for the given value

        // walk down the table, looking for the key
        // keep track of left and right boundary values
        let left = 0;
        for (let m = 0; m < this.table.length - 1; m++) {
            let right = this.table[m].right;
            // console.log("range: " + left + " " + right);
            if (value > left && value <= right) {
                // console.log("value: " + this.table[m].value);
                return this.table[m].value;
            }
            left = right;
        }
        // bigger than the last key, return the default value
        return this.table[this.table.length - 1].value;
    }
}