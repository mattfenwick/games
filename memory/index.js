'use strict';


let body = document.getElementById("game-board-tbody");
let row = body.insertRow();
let i = 0;
for (const [food, c] of Object.entries(characters)) {
    let cell = row.insertCell();
    cell.appendChild(document.createTextNode(`${food}: ${c}`));
    i++;
    if (i === 6) {
        i = 0;
        row = body.insertRow();
    }
}



// const boardCellClass = 'game.board.cell';
// const playerTurnClass = 'player-turn';

// let configDiv = document.getElementById('config');
// let configSizeDropdown = document.getElementById('config.size');
// let configStartButton = document.getElementById('config.start');

// let gameDiv = document.getElementById('game');
// let gameFirstPlayer = document.getElementById('game-first-player');
// let gameSecondPlayer = document.getElementById('game-second-player');
// let gameBoardTable = document.getElementById('game-board');
// let gameBoardTbody = document.getElementById('game-board-tbody');
// let gameRestartButton = document.getElementById('game.restart');

// function setShow(element, shouldShow) {
//     element.style.display = shouldShow ? '' : 'none';
// }


// // model
// const BoardSizeTiny = "tiny";
// const BoardSizeSmall = "small";
// const BoardSizeMedium = "medium";
// const BoardSizeLarge = "large";

// const FiveStateConfig = "fivestate: config";
// const FiveStateInProgress = "fivestate: in progress";

// class Five {
//     constructor() {
//         this.state = null;
//         this.setState(FiveStateConfig);
//         this.boardManager = new BoardManager();
//     }

//     setState(state) {
//         switch (state) {
//             case FiveStateConfig:
//                 setShow(configDiv, true);
//                 setShow(gameDiv, false);
//                 break;
//             case FiveStateInProgress:
//                 setShow(configDiv, false);
//                 setShow(gameDiv, true);
//                 break;
//             default:
//                 throw new Error(`unhandled state ${state}`);
//         }
//         this.state = state;
//     }

//     didClickStart() {
//         console.log("five: start");
//         if (this.state !== FiveStateConfig) {
//             throw new Error(`unable to start: in state ${this.state}`);
//         }
//         this.setState(FiveStateInProgress);
//         let width = 0;
//         let height = 0;
//         let size = configSizeDropdown.value;
//         switch (size) {
//             case BoardSizeTiny:
//                 width = 2;
//                 height = 2;
//                 break;
//             case BoardSizeSmall:
//                 width = 8;
//                 height = 8;
//                 break;
//             case BoardSizeMedium:
//                 width = 10;
//                 height = 10;
//                 break;
//             case BoardSizeLarge:
//                 width = 15;
//                 height = 15;
//                 break;
//             default:
//                 throw new Error(`invalid size ${size}`);
//         }
//         this.boardManager.startNewGame(width, height);
//     }

//     didClickRestart() {
//         console.log("five: restart");
//         if (this.state !== FiveStateInProgress) {
//             throw new Error(`unable to start: in state ${this.state}`);
//         }
//         this.setState(FiveStateConfig);
//     }
// }

// class BoardManager {
//     constructor() {
//         this.game = null;
//         this.cellRows = [];
//         gameFirstPlayer.textContent = `Player 1: ${Potato}`;
//         gameSecondPlayer.textContent = `Player 2: ${Tomato}`;
//         this.players = [Potato, Tomato];
//     }

//     startNewGame(width, height) {
//         if (this.state === GameStateInProgress) {
//             throw new Error(`unable to start game: game already in progress`);
//         }
//         // 1. create board model
//         this.game = new Game(width, height, this.players);
//         // 2. clear out old table children
//         // 3. create new table children
//         // 4. add listeners
//         this.setUpTable(width, height);
//         // 5. set DOM state
//         this.setState(GameStateInProgress);
//         this.setActivePlayer(this.game.nextPlayer);
//     }

//     setUpTable(xCount, yCount) {
//         // this.cellRows.forEach(row => row.forEach(e => e.remove()));
//         gameBoardTbody.textContent = '';
//         this.cellRows = [];

//         let self = this;
//         for (let y = 0; y < yCount; y++) {
//             let domRow = gameBoardTbody.insertRow();
//             let modelRow = [];
//             for (let x = 0; x < xCount; x++) {
//                 let xC = x; // TODO is it necessary to copy to avoid capture of mutable variable?
//                 let yC = y;
//                 let cell = domRow.insertCell();
//                 cell.setAttribute("x", x);
//                 cell.setAttribute("y", y);
//                 cell.classList.add(boardCellClass);
//                 cell.addEventListener('click', function() {
//                     self.didClickCell(cell, xC, yC);
//                 });
//                 modelRow.push(cell);
//             }
//             this.cellRows.push(modelRow);
//         }
//     }

//     setActivePlayer(playerIndex) {
//         console.log(`set active player to index ${playerIndex}`);
//         if (playerIndex === 0) {
//             gameFirstPlayer.classList.add(playerTurnClass);
//             gameSecondPlayer.classList.remove(playerTurnClass);
//         } else if (playerIndex === 1) {
//             gameFirstPlayer.classList.remove(playerTurnClass);
//             gameSecondPlayer.classList.add(playerTurnClass);
//         } else {
//             gameFirstPlayer.classList.remove(playerTurnClass);
//             gameSecondPlayer.classList.remove(playerTurnClass);
//         }
//     }

//     didClickCell(cell, x, y) {
//         console.log("didClickCell: %d, %d", x, y);
//         this.game.move(x, y);
//         cell.appendChild(document.createTextNode(this.game.board[x][y]));
//         if (this.game.state !== GameStateInProgress) {
//             this.setState(this.game.state);
//             if (this.game.winner) {
//                 console.log("winner: %s", JSON.stringify(this.game.winner));
//                 let self = this;
//                 this.game.winner.positions.forEach(function(pos) {
//                     let x = pos[0];
//                     let y = pos[1];
//                     self.cellRows[y][x].classList.add("winner-position");
//                 });
//             }
//             this.setActivePlayer(null);
//         } else {
//             this.setActivePlayer(this.game.nextPlayer);
//         }
//     }

//     removeCellListeners() {
//         for (let y = 0; y < this.cellRows.length; y++) {
//             let row = this.cellRows[y];
//             for (let x = 0; x < row.length; x++) {
//                 let cell = row[x];
//                 let cellCopy = cell.cloneNode(true);
//                 cell.parentNode.replaceChild(cellCopy, cell);
//                 row[x] = cellCopy;
//             }
//         }
//     }

//     setState(state) {
//         switch (state) {
//             case GameStateInProgress:
//                 setShow(gameRestartButton, false);
//                 break;
//             case GameStateWon:
//             case GameStateNoMoves:
//                 setShow(gameRestartButton, true);
//                 this.removeCellListeners();
//                 break;
//             default:
//                 throw new Error(`invalid state ${state}`);
//         }
//     }
// }

// Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(xs) {
    for (let i = xs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let a = xs[i];
        let b = xs[j];
        xs[i] = b;
        xs[j] = a;
    }
    return xs;
}

const GameStateMovePart1 = 'gamestate: move part 1';
const GameStateMovePart2 = 'gamestate: move part 2';
const GameStartOver = 'gamestate: over';

class Game {
    constructor(width, height, players, isRandom) {
        this.playerPairs = [];
        let self = this;
        players.forEach(function(p, ix) {
            if (!p) {
                throw new Error("invalid player: falsy at index " + ix);
            }
            // TODO should unique names be enforced?
            // if (self.playerPairs.has(p)) {
            //     throw new Error("duplicate player name: " + p);
            // }
            self.playerPairs.push([]);
        })
        if (players.length !== 2) {
            // TODO allow 1-4 ?
            throw new Error("expected 2 players, found %d", players.length);
        }
        this.players = players;
        this.width = width;
        this.height = height;

        this.state = GameStateMovePart1;
        this.nextPlayer = 0;

        let size = width * height;
        if (size % 2 > 0) {
            throw new Error(`invalid size: must be even, got ${size}`);
        }
        let half = size / 2;
        let availableChars = Object.keys(characters);
        if (isRandom) {
            availableChars = shuffle(availableChars);
        }
        if (half > availableChars.length) {
            throw new Error(`game board too large: need ${size}, max chars is ${availableChars.length * 2}`);
        }
        let chars = availableChars.slice(0, half);
        let charPairs = chars.concat(chars);
        if (isRandom) {
            charPairs = shuffle(charPairs);
        }
        this.board = Array(width).fill(null).map(x => Array(height).fill(null));
        let i = 0;
        for (let row = 0; row < width; row++) {
            for (let col = 0; col < height; col++) {
                this.board[row][col] = characters[charPairs[i]];
                i++;
            }
        }

        this.faceUp = null;
        this.remainingPairs = half;
    }

    flipCard(x, y) {
        console.log("player %s move to %d, %d", this.nextPlayer, x, y);
        if (!(x >= 0 && x < this.width)) {
            throw new Error("invalid x coordinate: " + x);
        }
        if (!(y >= 0 && y < this.height)) {
            throw new Error("invalid y coordinate: " + y);
        }
        if (this.board[x][y] === null) {
            throw new Error(`already taken: ${x, y}`);
        }

        if (this.state === GameStateMovePart1) {
            this.faceUp = [x, y];
            this.state = GameStateMovePart2;
        } else if (this.state === GameStateMovePart2) {
            if (x === this.faceUp[0] && y === this.faceUp[1]) {
                throw new Error(`invalid move, already face up: ${x, y}`);
            }
            if (this.board[x][y] === this.board[this.faceUp[0]][this.faceUp[1]]) {
                let pairs = this.playerPairs[this.nextPlayer];
                pairs.push([this.faceUp, [x, y]]);
                this.playerPairs[this.nextPlayer] = pairs;
                this.remainingPairs--;
                if (this.remainingPairs === 0) {
                    this.state = GameStartOver;
                    return;
                }
            }
            this.state = GameStateMovePart1;
            this.faceUp = null;
            this.nextPlayer++;
            if (this.nextPlayer >= this.players.length) {
                this.nextPlayer = 0;
            }
            console.log(`continuing game, switching to player ${this.nextPlayer}`);
        } else {
            throw new Error(`cannot move: game not in right state (state: ${this.state})`);
        }
    }

    isValid() {
        let counts = new Map();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let c = this.board[x][y];
                if (!counts.has(c)) {
                    counts.set(c, 0);
                }
                counts.set(c, counts.get(c) + 1);
            }
        }
        console.log(`counts: ${JSON.stringify(counts)}`);
        return Array.from(counts.values).filter(c => c != 2).length === 0;
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

    debugDump() {
        console.log(JSON.stringify({
            next: this.nextPlayer,
            pairs: this.playerPairs,
            faceUp: this.faceUp,
            state: this.state,
        }));
        console.log(this.toPrettyString());
    }
}
// end model


// // tests
function runTests() {
    let board = new Game(2, 2, ["X", "O"], false);

    console.log(board.toPrettyString());
    console.log(`is valid? ${board.isValid()}`);

    board.flipCard(0, 0);
    board.debugDump();

    board.flipCard(0, 1);
    board.debugDump();

    board.flipCard(0, 0);
    board.debugDump();

    board.flipCard(1, 0);
    board.debugDump();

    board.flipCard(0, 1);
    board.debugDump();

    board.flipCard(1, 1);
    board.debugDump();

    // board.move(3, 7);
    // console.log(board.toPrettyString());

    // board.move(0, 0);
    // console.log(board.toPrettyString());

    // board.move(3, 1);
    // console.log(board.toPrettyString());

    // let moves = [
    //     [0, 0],
    //     [1, 0],
    //     [0, 1],
    //     [2, 0],
    //     [0, 2],
    //     [3, 0],
    //     [0, 3],
    //     [4, 0],
    // ];

    // let board2 = new Game(6, 10, ["X", "O"]);
    // for (const move of moves) {
    //     console.log(`board2 move: ${move}`);
    //     board2.move.apply(board2, move);
    //     console.log(board2.toPrettyString());
    //     console.log("taken and same? %s", board2.areLocationsTakenAndSame([[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]));
    // }
}

runTests();
// // end tests



// // DOM manipulation
// let five = new Five();

// let didClickConfigStart = () => {
//     console.log('start clicked! %s', configSizeDropdown.value);
//     five.didClickStart();
// };
// configStartButton.addEventListener('click', didClickConfigStart);

// let didClickGameRestart = () => {
//     console.log('restart clicked!');
//     five.didClickRestart();
// };
// gameRestartButton.addEventListener('click', didClickGameRestart);
