'use strict';

const PlayerEmojis = shuffle(Object.keys(peopleEmojis));



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


const playerElements = document.querySelector(".config-player");

// const boardCellClass = 'game-board-cell';
// const playerTurnClass = 'player-turn';

let configDiv = document.getElementById('config');
let configPlayerCountDropdown = document.getElementById('config-player-count');
let configStartButton = document.getElementById('config-start');

let gameDiv = document.getElementById('game');
let gameBoardTable = document.getElementById('game-board');
let gameBoardTbody = document.getElementById('game-board-tbody');
let gameRestartButton = document.getElementById('game-restart');

function setShow(element, shouldShow) {
    element.style.display = shouldShow ? '' : 'none';
}


const ManagerStateConfig        = 'managerstate: config';
const ManagerStateInProgress    = 'managerstate: in progress';
const ManagerStateOver          = 'managerstate: over';

class Manager {
    constructor(playerCount, isRandom) {
        this.isRandom = isRandom;
        this.game = null;
        this.cellRows = [];
        gameFirstPlayer.textContent = `Player 1: ${Potato}`;
        gameSecondPlayer.textContent = `Player 2: ${Tomato}`;
        if (playerCount < 1 || playerCount > 4) {
            throw new Error(`expected 1 <= player count <= 4, got ${playerCount}`);
        }
        this.players = PlayerEmojis.slice(0, playerCount);
        this.setState(ManagerStateConfig);
    }

    didClickCell(cell, x, y) {
        console.log(`didClickCell: ${x}, ${y}; ${this.state}, ${this.game.state}`);
        if (this.state !== ManagerStateInProgress || (this.game.state !== GameStateMovePart1 && this.game.state.GameStateMovePart2)) {
            console.log(`ignoring cell click, manager or game not in proper state`);
            return;
        }
        this.game.flipCard(x, y);
    }

    didClickStart() {
        console.log("manager: start");
        if (this.state !== ManagerStateConfig) {
            throw new Error(`unable to start: in state ${this.state}`);
        }
        let playerCount = parseInt(configPlayerCountDropdown.value, 10);
        this.players = PlayerEmojis.slice(playerCount); // TODO get rid of this side communication channel
        this.setState(ManagerStateInProgress);
    }

    didClickRestart() {
        console.log("manager: restart");
        if (this.state !== ManagerStateOver) {
            throw new Error(`unable to start: in state ${this.state}`);
        }
        this.setState(ManagerStateConfig);
    }

    startNewGame(width, height) {
        if (this.state !== ManagerStateConfig) {
            throw new Error(`unable to start game from state ${this.state}`);
        }
        this.game = new Game(width, height, this.players, this.isRandom, (gameState) => this.didChangeGameState(gameState));
        this.setUpTable(width, height);
    }

    setUpTable(xCount, yCount) {
        // 1. clear out old table children
        // 2. create new table children
        // 3. add listeners

        // TODO is this explicit removal necessary?
        this.cellRows.forEach(row => row.forEach(e => e.remove()));

        gameBoardTbody.textContent = '';
        this.cellRows = [];

        let self = this;
        for (let y = 0; y < yCount; y++) {
            let domRow = gameBoardTbody.insertRow();
            let modelRow = [];
            for (let x = 0; x < xCount; x++) {
                let xC = x;
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
        playerElements.forEach((e, ix) => {
            if (ix === playerIndex) {
                e.classList.add(playerTurnClass);
            } else {
                e.classList.remove(playerTurnClass);
            }
        })
    }

    setFaceUp(coord) {
        throw new Error("TODO");
    }

    setFaceDown(coord) {
        throw new Error("TODO");
    }

    didChangeGameState(gameState) {
        let self = this;
        switch (gameState) {
            case GameStateMovePart1:
                // from new game, move part3:
                this.setActivePlayer(playerIndex);
                // from move part3:
                //   if found pair: remove cards from board; update pair lists TODO
                //   if no pair: flip cards back to face down TODO
                break;
            case GameStateMovePart2:
                // flip first card face up
                this.setFaceUp(this.game.faceUp[this.game.faceUp.length - 1]);
                break;
            case GameStateMovePart3:
                // flip second card face up
                this.setFaceUp(this.game.faceUp[this.game.faceUp.length - 1]);
                // set up timer for next state change
                setTimeout(function() {
                    self.game.setState(GameStateMovePart1);
                }, 5000);
                // ignore clicks until state change -> move part1
                break;
            case GameStateOver:
                this.setState(ManagerStateOver);
                break;
            default:
                throw new Error(`invalid game state ${state}`);
        }
        throw new Error(`TODO ${gameState}, ${playerIndex}`);
    }

    setState(state) {
        switch (state) {
            case ManagerStateConfig:
                setShow(configDiv, true);
                setShow(gameDiv, false);
                break;
            case ManagerStateInProgress:
                this.startNewGame(8, 8); // TODO configurable size?
                setShow(configDiv, false);
                setShow(gameDiv, true);
                setShow(gameRestartButton, false);
                break;
            case ManagerStateOver:
                setShow(gameRestartButton, true);
                break;
            default:
                throw new Error(`invalid manager state ${this.state}`);
        }
        this.state = state;
    }
}

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
const GameStateMovePart3 = 'gamestate: move part 3';
const GameStateOver = 'gamestate: over';

class Game {
    constructor(width, height, players, isRandom, didChangeState) {
        this.didChangeState = didChangeState;
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
        if (players.length < 1 || players.length > 4) {
            throw new Error("expected 1 - 4 players, found %d", players.length);
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
            this.setState(GameStateMovePart2);
        } else if (this.state === GameStateMovePart2) {
            if (x === this.faceUp[0] && y === this.faceUp[1]) {
                throw new Error(`invalid move, already face up: ${x, y}`);
            }
            // found a matching pair: add it to the player's pile
            if (this.board[x][y] === this.board[this.faceUp[0]][this.faceUp[1]]) {
                let pairs = this.playerPairs[this.nextPlayer];
                pairs.push([this.faceUp, [x, y]]);
                this.playerPairs[this.nextPlayer] = pairs;
                this.remainingPairs--;
                // no more cards left: game is over
                if (this.remainingPairs === 0) {
                    this.setState(GameStateOver);
                    return;
                }
            }
            this.setState(GameStateMovePart3);
            console.log(`continuing game, switching to player ${this.nextPlayer}`);
        } else {
            throw new Error(`cannot move: game not in right state (state: ${this.state})`);
        }
    }

    setState(state) {
        switch (state) {
            case GameStateMovePart1:
                this.faceUp = null;
                break;
            case GameStateMovePart2:
                break;
            case GameStateMovePart3:
                this.nextPlayer++;
                if (this.nextPlayer >= this.players.length) {
                    this.nextPlayer = 0;
                }
                break;
            case GameStateOver:
                break;
            default:
                throw new Error(`invalid game state ${state}`);
        }
        this.didChangeState(state);
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
