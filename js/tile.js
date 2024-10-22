//     File: tile.js
//     Synopsis: A Tile represents the image fragment that gets pushed around
//               by the player.
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

class Tile {
    constructor(position, duplicateDeltas, img, tileSize) {
        // A Tile represents the image fragment that gets pushed around
        // by the player.  Its main responsibility is to remember its own position,
        // and draw itself when asked.

        // position: an object with (x,y) properties representing the Tile's position in pixel space.
        // value: the value associated with the Tile (e.g. the image data).
        // duplicateDeltas: an object with x and y properties representing offsets in pixel space
        // for duplicate images to be drawn, usually the full width or height of the full image.
        // See draw()

        // console.log("making tile at " + position.x + ", " + position.y);
        this._x = position.x;
        this._y = position.y;

        this._deltax = duplicateDeltas.x;
        this._deltay = duplicateDeltas.y;
        this._img = img;
        this._tilew = tileSize.w;  // scaled size
        this._tileh = tileSize.h;  // scaled size
    }

    updatePositionBy(position) {
        // updates the Tile's position by adding the x and y values from the
        // position argument to its current x and y values.

        this._x += position.x;
        this._y += position.y;
    }

    setX(position) {
        // changes the Tile's position to the given position argument
        this._x = position;
    }

    setY(position) {
        // changes the Tile's position to the given position argument
        this._y = position;
    }

    setRow(row) {
        this.setY(row * this._tileh);
    }

    setCol(col) {
        this.setX(col * this._tilew);
    }

    __draw_helper(dx, dy, ctx) {
        const x = this._x + dx;
        const y = this._y + dy;

        // Set the alpha value to make the image slightly darker when highlighted
        // ctx.globalAlpha = highlight ? 0.6 : 1.0;
        ctx.clearRect(x, y, this._tilew, this._tileh);
        ctx.drawImage(this._img, 0, 0, this._img.width, this._img.height,
            x, y, this._tilew, this._tileh);
        // Restore the default alpha value for other drawing operations
        // ctx.globalAlpha = 1.0;

        ctx.strokeStyle = '#202020';
        ctx.strokeRect(x, y, this._tilew, this._tileh);
    }

    draw(ctx, highlight) {
        // draws the Tile on a canvas context (ctx) using the Tile's value property.
        // Two copies of the Tile are drawn for some tiles near the edges, to make
        // sliding tiles at the boundaries easier; Only the bits within the
        // canvas are rendered.
        // The highlight argument is used to determine if the Tile should be
        // highlighted when drawn.


        // console.log("drawing " + t his._img.src + " at " + this._x +" , " + this._y);
        this.__draw_helper(0, 0, ctx);
        if (this._x + this._tilew > ctx.canvas.width) {
            this.__draw_helper(-this._deltax, 0, ctx);
        }
        if (this._x - this._tilew < 0) {
            this.__draw_helper(this._deltax, 0, ctx);
        }
        if (this._y + this._tileh > ctx.canvas.height) {
            this.__draw_helper(0, -this._deltay, ctx);
        }
        if (this._y - this._tileh < 0) {
            this.__draw_helper(0, this._deltay, ctx);
        }

    }
}

