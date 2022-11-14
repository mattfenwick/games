'use strict';

const Potato = "\uD83E\uDD54";
const Tomato = "\uD83C\uDF45";


const boardCellClass = 'game.board.cell';
const playerTurnClass = 'player-turn';

let configDiv = document.getElementById('config');
let configSizeDropdown = document.getElementById('config.size');
let configStartButton = document.getElementById('config.start');

let gameDiv = document.getElementById('game');
let gameFirstPlayer = document.getElementById('game-first-player');
let gameSecondPlayer = document.getElementById('game-second-player');
let gameBoardTable = document.getElementById('game-board');
let gameBoardTbody = document.getElementById('game-board-tbody');
let gameRestartButton = document.getElementById('game.restart');

function setShow(element, shouldShow) {
    element.style.display = shouldShow ? '' : 'none';
}


// model
const BoardSizeTiny = "tiny";
const BoardSizeSmall = "small";
const BoardSizeMedium = "medium";
const BoardSizeLarge = "large";

const FiveStateConfig = "fivestate: config";
const FiveStateInProgress = "fivestate: in progress";

class Five {
    constructor() {
        this.state = null;
        this.setState(FiveStateConfig);
        this.boardManager = new BoardManager();
    }

    setState(state) {
        switch (state) {
            case FiveStateConfig:
                setShow(configDiv, true);
                setShow(gameDiv, false);
                break;
            case FiveStateInProgress:
                setShow(configDiv, false);
                setShow(gameDiv, true);
                break;
            default:
                throw new Error(`unhandled state ${state}`);
        }
        this.state = state;
    }

    didClickStart() {
        let size = configSizeDropdown.value;
        console.log(`five: start; size ${size}`);
        if (this.state !== FiveStateConfig) {
            throw new Error(`unable to start: in state ${this.state}`);
        }
        this.setState(FiveStateInProgress);
        let width = 0;
        let height = 0;
        switch (size) {
            case BoardSizeTiny:
                width = 2;
                height = 2;
                break;
            case BoardSizeSmall:
                width = 8;
                height = 8;
                break;
            case BoardSizeMedium:
                width = 10;
                height = 10;
                break;
            case BoardSizeLarge:
                width = 15;
                height = 15;
                break;
            default:
                throw new Error(`invalid size ${size}`);
        }
        this.boardManager.startNewGame(width, height);
    }

    didClickRestart() {
        console.log("five: restart");
        if (this.state !== FiveStateInProgress) {
            throw new Error(`unable to start: in state ${this.state}`);
        }
        this.setState(FiveStateConfig);
    }
}

class BoardManager {
    constructor() {
        this.game = null;
        this.cellRows = [];
        gameFirstPlayer.textContent = `Player 1: ${Potato}`;
        gameSecondPlayer.textContent = `Player 2: ${Tomato}`;
        this.players = [Potato, Tomato];
    }

    startNewGame(width, height) {
        if (this.game !== null && this.game.state === GameStateInProgress) {
            throw new Error(`unable to start game: game already in progress`);
        }
        // 1. create board model
        this.game = new Game(width, height, this.players);
        // 2. clear out old table children
        // 3. create new table children
        // 4. add listeners
        this.setUpTable(width, height);
        // 5. set DOM state
        this.setState(GameStateInProgress);
        this.setActivePlayer(this.game.nextPlayer);
    }

    setUpTable(xCount, yCount) {
        // this.cellRows.forEach(row => row.forEach(e => e.remove()));
        gameBoardTbody.textContent = '';
        this.cellRows = [];

        let self = this;
        for (let y = 0; y < yCount; y++) {
            let domRow = gameBoardTbody.insertRow();
            let modelRow = [];
            for (let x = 0; x < xCount; x++) {
                let xC = x; // TODO is it necessary to copy to avoid capture of mutable variable?
                let yC = y;
                let cell = domRow.insertCell();
                cell.setAttribute("x", x);
                cell.setAttribute("y", y);
                cell.classList.add(boardCellClass);
                cell.addEventListener('click', function() {
                    self.didClickCell(cell, xC, yC);
                });
                modelRow.push(cell);
            }
            this.cellRows.push(modelRow);
        }
    }

    setActivePlayer(playerIndex) {
        console.log(`set active player to index ${playerIndex}`);
        if (playerIndex === 0) {
            gameFirstPlayer.classList.add(playerTurnClass);
            gameSecondPlayer.classList.remove(playerTurnClass);
        } else if (playerIndex === 1) {
            gameFirstPlayer.classList.remove(playerTurnClass);
            gameSecondPlayer.classList.add(playerTurnClass);
        } else {
            gameFirstPlayer.classList.remove(playerTurnClass);
            gameSecondPlayer.classList.remove(playerTurnClass);
        }
    }

    didClickCell(cell, x, y) {
        console.log("didClickCell: %d, %d", x, y);
        this.game.move(x, y);
        cell.appendChild(document.createTextNode(this.game.board[x][y]));
        if (this.game.state !== GameStateInProgress) {
            this.setState(this.game.state);
            if (this.game.winner) {
                console.log("winner: %s", JSON.stringify(this.game.winner));
                let self = this;
                this.game.winner.positions.forEach(function(pos) {
                    let x = pos[0];
                    let y = pos[1];
                    self.cellRows[y][x].classList.add("winner-position");
                });
            }
            this.setActivePlayer(null);
        } else {
            this.setActivePlayer(this.game.nextPlayer);
        }
    }

    removeCellListeners() {
        for (let y = 0; y < this.cellRows.length; y++) {
            let row = this.cellRows[y];
            for (let x = 0; x < row.length; x++) {
                let cell = row[x];
                let cellCopy = cell.cloneNode(true);
                cell.parentNode.replaceChild(cellCopy, cell);
                row[x] = cellCopy;
            }
        }
    }

    setState(state) {
        switch (state) {
            case GameStateInProgress:
                setShow(gameRestartButton, false);
                break;
            case GameStateWon:
            case GameStateNoMoves:
                setShow(gameRestartButton, true);
                this.removeCellListeners();
                break;
            default:
                throw new Error(`invalid state ${state}`);
        }
    }
}

const GameStateInProgress = 'gamestate: in progress';
const GameStateWon = 'gamestate: won';
const GameStateNoMoves = 'gamestate: no moves';

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
            this.state = GameStateWon;
            this.winner = winner;
            return;
        }

        // check if move is available
        console.log("checking if move is available");
        if (!this.isMoveAvailable()) {
            console.log("move is not available: game over");
            this.state = GameStateNoMoves;
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
        let xStartsWidth = (this.width - 4 > 0) ? (this.width - 4) : 0;
        let xStarts = Array(xStartsWidth).fill(0).map((_, i) => i);
        let yStartsWidth = (this.height - 4 > 0) ? (this.height - 4) : 0;
        let ys = Array(yStartsWidth).fill(0).map((_, i) => i);
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
        // console.log("taken/same: %s", JSON.stringify(locations));
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



// DOM manipulation
let five = new Five();

let didClickConfigStart = () => {
    console.log('start clicked! %s', configSizeDropdown.value);
    five.didClickStart();
};
configStartButton.addEventListener('click', didClickConfigStart);

let didClickGameRestart = () => {
    console.log('restart clicked!');
    five.didClickRestart();
};
gameRestartButton.addEventListener('click', didClickGameRestart);
