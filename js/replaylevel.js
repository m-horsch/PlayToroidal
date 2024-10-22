//     File: replaylevel.js
//     Synopsis: A Replaylevel represents all the details to replay a recorded sequence of moves,
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

class Replaylevel extends Baselevel {
    constructor(details) {
        super(details);
        this.actions = details.actions.split(" ");
        this.actions_cursor = 0;
        // console.log("finished replay level constructor");
    }

    reset(cellW, cellH) {
        // console.log("reset Replaylevel");
        super.reset(cellW, cellH);
        this.actions_cursor = 0;
    }

    action_start() {
        this.actions_cursor = 0;
    }

    action_hasnext() {
        return this.actions_cursor < this.actions.length;
    }

    action_next() {
        const action = this.actions[this.actions_cursor];
        if (this.actions_cursor === this.actions.length) {
            console.log("should disable step");
            return null;
        }
        else {
            this.actions_cursor += 1;
            return action;
        }
    }

}