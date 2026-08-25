//     File: Replay.js
//     Synopsis: The main object for the replay visualization.
//     Copyright (C) 2023-2026 Michael C Horsch
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

// Here we set everything up in the right order, so that the game will start

class Replay {
    constructor(puzzleEntry) {
        // This object coordinates and initiates the application.
        // The component objects are created, then informed of each
        // other's existence.

        this.puzzleEntry = puzzleEntry;
        this.theLevelData = null;
        this.theLevel = null;
        this.theController = null;
        this.theView = null;
    }

    async init() {
        // try to grab the entry using the given puzzleEntry

        const {tiling, config} = await loadPuzzle(this.puzzleEntry);
        const replay = await loadReplay(this.puzzleEntry);
        // console.log("loading game data from json file "+ this.jsonfilepath );
        this.theLevelData = [tiling, config, replay];
        // console.log(this.theLevelData);
        // console.log("finished loading game data from json file");
        this.theLevel = new Replaylevel(tiling, config, replay);
        this.theController = new ReplayControl(this.theLevel);
        this.theView = new ReplayView(this.theLevel);
        this.theController.makeConnect(this.theView);
        this.theView.makeConnect(this.theController);

    }

    reset() {
        // When the player clicks [Reset], reset!
        // console.log("reset Replay");
        this.theLevel.reset(this.theView.cellWidth, this.theView.cellHeight);
        this.theView.reset();
        this.theController.reset();
    }

    play() {
        // when the use clicks [Play], move forward in the actions
        // console.log("play Replay");
        this.theController.play();
    }

    step() {
        // when the user clicks [Step], move forward one step
        // console.log("step Replay");
        this.theController.step();
    }
}
