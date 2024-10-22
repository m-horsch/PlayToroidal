//     File: replaycontrol.js
//     Synopsis: the logic for interpreting actions from a given replay file
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

// This file contains the logic for interpreting actions
// from a given replay JSON file.

class ReplayControl extends Basecontrol {
    constructor(theLevel) {
        // This object contains all the control variables
        // for calculating the effects of the replay on the play-torus.

        super(theLevel);

        // Get references to the slider and the element displaying its value
        this.speed_slider = document.getElementById('speed');

        const self = this;
        // Add an event listener to the slider to handle its value changes
        this.speed_slider.addEventListener('input', () => {
            console.log("set speed to " + self.speed_slider.value);
            self.slide_time = this.max_slide_time /  self.speed_slider.value;
        });
        this.slide_time = this.max_slide_time /  this.speed_slider.value;
        this.playing = false;

        // console.log("finished replay control constructor");
    }


    reset() {
        this.animating = false;
        this.playing = false;
    }


    __action_player() {
        if (!this.level.action_hasnext()) {
            this.playing = false;
            return;
        }

        this.step();
        const self = this;
        const timeout = setTimeout(function () {self.__action_player();}, this.slide_time);
    };

    play() {
        if (this.playing || this.animating ) {
            return;
        }
        this.playing = true;

        this.__action_player();
    }

    step() {
        // get out early if there are no more steps
        if (!this.level.action_hasnext() || this.animating ) {
            return;
        }
        this.animating = true;
        this.view.updateCounter();
        const action = this.level.action_next();

        this.animateAction(action, this.animateTiles[action[0]]);
    }

}
