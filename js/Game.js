//     File: Game.js
//     Synopsis: Set everything up for the game, given a gamefile.
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

// Here we set everything up in the right order, so that the game will start

class Game {
    constructor(jsonfilepath)
    {
        // This object coordinates and initiates the application.
        // The component objects are created, then informed of each
        // other's existence.

        this.jsonfilename = "puzzles/" + jsonfilepath;
        const self = this;

        // this is asynchronous, obviously not obvious
        fetch(this.jsonfilename)
            .then(Response => Response.json())
            .then(data => {
                // console.log("loading game data from json file "+ this.jsonfilepath );
                self.theLevelData = data;
                self.theLevel = new Playlevel(self.theLevelData);
                self.theController = new Control(self.theLevel);
                self.theView = new View(self.theLevel);
                self.theController.makeConnect(self.theView);
                self.theView.makeConnect(self.theController);
            });
    }

    reset() {
        // When the player clicks [Reset], reset!

        // console.log("reset Game");
        this.theLevel.reset(this.theView.cellWidth, this.theView.cellHeight);
        this.theView.reset();
        this.theController.reset();
    }
}