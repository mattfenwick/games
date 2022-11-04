'use strict';


// model
class Five {
    constructor() {
        this.state = "config";
        this.width = 15;
        this.height = 15;
    }
}

const GameStateInProgress = 'in progress';
const GameStateFinished = 'finished';

class Game {
    constructor(width, height, players) {
        players.forEach(function(p, ix) {
            if (!p) {
                throw new Error("invalid player: falsy at index " + ix);
            }
        })
        if (players.length !== 2) {
            throw new Error("expected 2 players, found %d", players.length);
        }
        this.players = players;
        this.width = width;
        this.height = height;

        this.state = GameStateInProgress;
        this.nextPlayer = 0;
        this.winner = null;

        this.board = Array(width).fill(null).map(x => Array(height).fill(null));
    }

    move(x, y) {
        console.log("player %s move to %d, %d", this.nextPlayer, x, y);
        if (this.state !== GameStateInProgress) {
            throw new Error(`cannot move: game not in progress (state: ${this.state})`);
        }
        if (!(x >= 0 && x < this.width)) {
            throw new Error("invalid x coordinate: " + x);
        }
        if (!(y >= 0 && y < this.height)) {
            throw new Error("invalid y coordinate: " + y);
        }
        if (this.board[x][y]) {
            throw new Error("position already taken: " + x + ", " + y);
        }
        console.log("move is legal");
        this.board[x][y] = this.players[this.nextPlayer];
        console.log("finished move, now checking for winner");
        let winner = this.checkForWinner();
        console.log("is there a winner? %s", JSON.stringify(winner));
        if (winner) {
            this.state = GameStateFinished;
            this.winner = winner;
            return;
        }

        // check if move is available
        console.log("checking if move is available");
        if (!this.isMoveAvailable()) {
            console.log("move is not available: game over");
            this.state = GameStateFinished;
            return;
        }

        // change player
        console.log("continuing game, switching player");
        this.nextPlayer++;
        if (this.nextPlayer >= this.players.length) {
            this.nextPlayer = 0;
        }

        console.log("next up is player %s", this.players[this.nextPlayer]);
    }

    isMoveAvailable() {
        for (let x = 0; x < this.board.length; x++) {
            let row = this.board[x];
            for (let y = 0; y < row.length; y++) {
                let square = row[y];
                console.log("inspecting %d, %d: value %s", x, y, square);
                if (!square) {
                    return true;
                }
            }
        }
        return false;
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
                let positions = five.map(offset => [x, y + offset]);
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
        console.log("taken/same: %s", JSON.stringify(locations));
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

    isOver() {
        return this.state === GameStateFinished;
    }
}
// end model


// tests

function runTests() {
    let board = new Game(6, 10, ["X", "O"]);

    console.log(board.toPrettyString());

    board.move(3, 7);
    console.log(board.toPrettyString());

    board.move(0, 0);
    console.log(board.toPrettyString());

    board.move(3, 1);
    console.log(board.toPrettyString());

    let moves = [
        [0, 0],
        [1, 0],
        [0, 1],
        [2, 0],
        [0, 2],
        [3, 0],
        [0, 3],
        [4, 0],
        [0, 4],
    ];

    let board2 = new Game(6, 10, ["X", "O"]);
    for (const move of moves) {
        console.log(`board2 move: ${move}`);
        board2.move.apply(board2, move);
        console.log(board2.toPrettyString());
        console.log("taken and same? %s", board2.areLocationsTakenAndSame([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]));
    }
}

runTests();
// end tests

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
