//     File: playlevel.js
//     Synopsis: A Playlevel represents all the details for a particular puzzle.
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

class Playlevel extends Baselevel {
    constructor(details) {
        /*
        A Playlevel represents all the details for a particular puzzle.  It's the model in MVC.
        It's a bit redundant, as most of these details are in the given JSON object.
        This object contains the data defined in the JSON files.
        It also stores the two Torus objects for the start and end states, and various other
        data.
         */
        super(details);

        // auxiliary state for display
        this.blurb = details.blurb || null;
        this.rating = details.rating || null;
        this.nextPage = details.next || getpuzz(getRandomDate(firstpuzz, lastpuzz));

        // a function to check if the state and the goal state are the same
        this.goalStateReached = this.theGoalTorus.equalityTestF(this.theTorus);

        // console.log("finished level constructor");
    }

}


