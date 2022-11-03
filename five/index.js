'use strict';

console.log("hi");

class Five {
    constructor() {
        this.state = "config";
        this.width = 15;
        this.height = 15;
    }
}

class Game {
    constructor(width, height, players) {
        players.forEach(function(p, ix) {
            if (!p) {
                throw new Error("invalid player: falsy at index " + ix);
            }
        })
        this.players = players;
        this.state = {'mode': 'in progress', nextPlayer: 0};
        this.width = width;
        this.height = height;
        this.board = Array(width).fill(null).map(x => Array(height).fill(null));
    }

    move(x, y) {
        console.log("player %s move to %d, %d", this.state.nextPlayer, x, y);
        if (this.state.mode != 'in progress') {
            throw new Error("cannot move: game not in progress");
        }
        if (x < 0 || x >= this.width) {
            throw new Error("invalid x coordinate: " + x);
        }
        if (y < 0 || y >= this.height) {
            throw new Error("invalid y coordinate: " + y);
        }
        if (this.board[x][y]) {
            throw new Error("position already taken: " + x + ", " + y);
        }
        console.log("move is legal");
        this.board[x][y] = this.players[this.state.nextPlayer];
        console.log("finished move");
        let winner = this.checkForWinner();
        console.log("is there a winner? %s", JSON.stringify(winner));
        if (winner) {
            this.state = {mode: 'finished', winner: winner};
            return;
        }
        console.log("no winner; is the game over?");
        // check if move is available
        // TODO calculate: moveAvailable
        if (false) {//!moveAvailable) {
            this.state = {mode: 'finished', winner: null};
            return;
        }

        console.log("game is not over: continuing");
        // change player
        this.state.nextPlayer++;
        if (this.state.nextPlayer >= this.players.length) {
            this.state.nextPlayer = 0;
        }
        console.log("next up is player %s", this.players[this.state.nextPlayer]);
    }

    toPrettyString() {
        let rows = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(this.board[x][y] ? this.board[x][y] : ".");
            }
            rows.push(row.join(" "));
        }
        return rows.join("\n");
    }

    checkForWinner() {
        let xs = Array(this.width).fill(0).map((_, i) => i);
        let xStarts = Array(this.width - 4 ).fill(0).map((_, i) => i);
        let ys = Array(this.height - 4 ).fill(0).map((_, i) => i);
        let yStarts = Array(this.height).fill(0).map((_, i) => i);
        let five = [0, 1, 2, 3, 4];
        let self = this;
        // horizontal
        for (const x of xStarts) {
            for (const y of ys) {
                let positions = five.map(offset => [x + offset, y]);
                let winner = self.areLocationsTakenAndSame(positions);
                if (winner) {
                    return {'winner': winner, 'positions': positions};
                }
            }
        }
        // vertical
        for (const x of xs) {
            for (const y of yStarts) {
                let positions = five.map(offset => [x + offset, y]);
                let winner = self.areLocationsTakenAndSame(positions);
                if (winner) {
                    return {'winner': winner, 'positions': positions};
                }
            }
        }
        // diagonal: top left -> bottom right
        for (const x of xStarts) {
            for (const y of yStarts) {
                let positions = five.map(offset => [x + offset, y + offset]);
                let winner = self.areLocationsTakenAndSame(positions);
                if (winner) {
                    return {'winner': winner, 'positions': positions};
                }
            }
        }
        // diagonal: bottom left -> top right
        for (const x of xStarts) {
            for (const y of yStarts) {
                let positions = five.map(offset => [x + offset, y + 4 - offset]);
                let winner = self.areLocationsTakenAndSame(positions);
                if (winner) {
                    return {'winner': winner, 'positions': positions};
                }
            }
        }
        return null;
    }

    areLocationsTakenAndSame(locations) {
        let self = this;
        let values = new Set();
        let last = null;
        for (const l of locations) {
            let x = l[0];
            let y = l[1];
            let value = self.board[x][y];
            if (!value) {
                return null;
            }
            values.add(value);
            last = value;
        }
        if (values.size === 1) {
            return last;
        }
        return null;
    }

    safeGet(x, y) {
        if (x < 0) {
            x += this.width;
        } else if (x >= this.width) {
            x -= this.width;
        }
        if (y < 0) {
            y += this.height;
        } else if (y >= this.height) {
            y -= this.height;
        }
        return this.board[x][y];
    }

    get isOver() {
        return this.state['mode'] === 'finished';
    }

    // winner
}

let board = new Game(6, 10, ["X", "O"]);

console.log(board.toPrettyString());

board.move(3, 7);
console.log(board.toPrettyString());

board.move(0, 0);
console.log(board.toPrettyString());

board.move(3, 1);
console.log(board.toPrettyString());

// function showHideAll(shouldShow, selector) {
//     let elements = document.querySelectorAll(selector);
//     elements.forEach(function (e) {
//         e.style.display = shouldShow ? '' : 'none';
//     })
// }
//
// function readText(id) {
//     return document.getElementById(id).value;
// }
//
// function readBoolean(id) {
//     return document.getElementById(id).checked;
// }
//
// /* get references to DOM elements */
// let element = document.getElementById("output");
// let outputTextNode = document.createTextNode("");
// element.appendChild(outputTextNode);
//
// let abcDropdown = document.getElementById("abc");
// let defDropdown = document.getElementById("def-dropdown");
// let defCheckbox = document.getElementById("def-checkbox");
// /* end */
//
//
// /* set up listeners */
// function regenerateYaml() {
//     console.log("triggered: regen yaml");
//     outputTextNode.nodeValue = formatModel(readValuesFromUi());
// }
//
// let inputs = document.querySelectorAll("input");
// inputs.forEach(function (e) {
//     console.log("setting up input listener");
//     // which event to use: 'input' or 'change'?
//     //   From the docs: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
//     //     "Unlike the input event, the change event is not necessarily fired for each alteration to an element's value."
//     //   compare to: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event
//     e.addEventListener('input', regenerateYaml);
// });
// let selects = document.querySelectorAll("select");
// selects.forEach(function (e) {
//     console.log("setting up select listener");
//     e.addEventListener('change', regenerateYaml);
// });
//
//
// let didChangeAbc = () => {
//     let value = abcDropdown.value;
//     showHideAll(false, ".abc-type");
//     showHideAll(true, `.abc-${value}`);
// };
// abcDropdown.addEventListener('change', didChangeAbc);
//
// defCheckbox.addEventListener('change', () => {
//     let shouldShow = defCheckbox.checked;
//     showHideAll(shouldShow, ".def");
// });
//
// let didChangeDef = () => {
//     let value = defDropdown.value;
//     showHideAll(false, ".def-type");
//     showHideAll(true, `.def-${value}`);
// };
// defDropdown.addEventListener('change', didChangeDef);
// /* end */
//
//
// /* set up initial state */
// defCheckbox.setAttribute("checked", "true");
//
// didChangeAbc();
//
// didChangeDef();
//
// regenerateYaml();
// /* end */
