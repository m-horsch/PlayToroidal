//     File: loadData.js
//     Synopsis: Some functions to to manage and contain puzzles.json details
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


// grab the main json file
async function grabPUZZLESJSON() {
    // console.log("starting to grab");
    const indexResponse = await fetch("Assets/puzzles.json");
    const puzzlesIndex = await indexResponse.json();
    if (!indexResponse.ok) {
       throw new Error(`Failed to fetch puzzles.json: ${indexResponse.status}`);
    }
    // console.log("grabbed ", puzzlesIndex);
    return puzzlesIndex;
}



// get a valid puzzleEntry for a puzzle from the collection
// modeval could be something puzzleEntry-like, or null
// if modeval is not null, it might be a puzzleEntry.
// if modeval is not null, and a valid normal puzzleEntry, use it
// if modeval is null, pick a normal puzzle at random
// Note: this function should not be called by replay mode.
async function getEntry(modeval, puzzlesIndex) {
    // console.log("getting Entry", modeval);
    const keys = Object.keys(puzzlesIndex)
        .filter(key => puzzlesIndex[key].type === "normal");

    let key;
    if (modeval && modeval in puzzlesIndex) {
        key = modeval;
    } else {
        // or a random puzzleEntry
        key = keys[Math.floor(Math.random() * keys.length)];
    }

    // console.log("puzzleEntry =", puzzleEntry);
    // console.log("entry=", puzzlesIndex[puzzleEntry]);
    return puzzlesIndex[key];
}

// load the data for the puzzle entry
// the entry points to 2 specific files
// checks if the data loaded is consistent with expectations
async function loadPuzzle(puzzleEntry) {

    // console.log("Loading puzzle with entry:", puzzleEntry);

    const tilingUrl = `${puzzleEntry.path}/${puzzleEntry.tiling}`;
    const configUrl = `${puzzleEntry.path}/${puzzleEntry.config}`;

    const [tilingResponse, configResponse] = await Promise.all([
        fetch(tilingUrl),
        fetch(configUrl),
    ]);

    const [tiling, config] = await Promise.all([
        tilingResponse.json(),
        configResponse.json(),
    ]);

    // if (tiling.version !== config.version) {
    //     throw new Error("tiling and config files disagree on version");
    // }
    if (tiling.ntiles !== config.ntiles) {
        throw new Error("tiling and config files disagree on number of tiles");
    }
    if  (tiling.rows !== config.rows) {
        throw new Error("tiling and config files disagree on number of rows");
    }
    if (tiling.cols !== config.cols) {
        throw new Error("tiling and config files disagree on number of cols");
    }

    return { tiling, config };
}

// load the data for the puzzle entry
// checks if the data loaded is consistent with expectations
async function loadReplay(puzzleEntry) {
    // console.log("Loading replay data for entry:", puzzleEntry);

    const replayUrl = `${puzzleEntry.path}/${puzzleEntry.replay}`;

    const replayResponse = await fetch(replayUrl);
    const replay = await replayResponse.json();
    // console.log("fetched replay data", replay);
    return replay;
}