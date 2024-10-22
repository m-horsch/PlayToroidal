//     File: viewutils.js
//     Synopsis: A collection of functions to assist the View.
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

function formatTime(seconds) {
    // modified version of a time formatting method located using Google search
    // returns a string formatted in the following way:
    //      S if seconds < 10
    //      SS if seconds >= 10 seconds < 60
    //      M:SS if seconds >= 60  and seconds < 600
    //      MM:SS if seconds >= 600  and seconds < 3600
    //      HH:MM:SS if seconds >= 3600, but that won't fit in the HTML element, so I hope it never happens.

    "use strict";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours === 0 && minutes === 0) {
        return secs.toString();
    }

    const formattedSeconds = secs.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString();
    if (hours === 0) {
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const formattedHours = hours.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}


String.prototype.format = function () {
    // A function to imitate Pythons format method.  string.format(<args>)
    // from the web.  May not work if the first argument is zero!
    "use strict";

    const val1 = arguments;
    return this.replace(/{(\d+)}/g, function (get, number) {
        return typeof val1[number] !== "undefined" ? val1[number] : get;
    });
};

function getpuzz(date) {
    // return a string that tells where to find a puzzle for today's date
    // Currently, all puzzles are located in a directory structure with entries
    // puzzles/YYYY/MM/DD.json
    "use strict";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return year + "/" + month + "/" + day;
}

function getRandomDate(date1, date2) {
    // Convert dates to timestamps in milliseconds
    "use strict";

    const timestamp1 = date1.getTime();
    const timestamp2 = date2.getTime();
    // console.log(timestamp1);
    // console.log(timestamp2);

    // Get a random timestamp between the two dates
    const randomTimestamp = Math.floor(Math.random() * (timestamp2 - timestamp1)) + timestamp1;

    // Create a new Date object from the random timestamp
    const randomDate = new Date();
    randomDate.setTime(randomTimestamp);
    // console.log(randomDate);
    return randomDate;
}

