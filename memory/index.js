'use strict';

// free functions
function shuffle(xs) {
    // Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    for (let i = xs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let a = xs[i];
        let b = xs[j];
        xs[i] = b;
        xs[j] = a;
    }
    return xs;
}

function setShow(element, shouldShow) {
    element.style.display = shouldShow ? '' : 'none';
}
// end free functions


// constants
const PlayerEmojis = shuffle(Object.values(PeopleEmojis));

const BoardSizeTiny     = 'tiny';
const BoardSizeSmall    = 'small';
const BoardSizeMedium   = 'medium';
const BoardSizeLarge    = 'large';
const BoardSizeXL       = 'xl';

function BoardSizeDimensions(boardSize) {
    switch (boardSize) {
        case BoardSizeTiny: return [2, 5];
        case BoardSizeSmall: return [4, 4];
        case BoardSizeMedium: return [9, 4];
        case BoardSizeLarge: return [12, 6];
        case BoardSizeXL: return [14, 8];
        default: throw new Error(`invalid board size ${boardSize}`);
    }
}

function FaceUpWaitMilliseconds(boardSize) {
    switch (boardSize) {
        case BoardSizeTiny: return 2000;
        case BoardSizeSmall: return 1750;
        case BoardSizeMedium: return 1500;
        case BoardSizeLarge: return 1250;
        case BoardSizeXL: return 1000;
        default: throw new Error(`invalid board size ${boardSize}`);
    }
}

const ManagerStateConfig        = 'managerstate: config';
const ManagerStateInProgress    = 'managerstate: in progress';
const ManagerStateOver          = 'managerstate: over';

const GameStateMovePart1    = 'gamestate: move part 1';
const GameStateMovePart2    = 'gamestate: move part 2';
const GameStateMovePart3    = 'gamestate: move part 3';
const GameStateOver         = 'gamestate: over';

const boardCellClass    = 'game-board-cell';
const activePlayerClass = 'game-active-player';
// end constants


// dom elements
let playerElements      = document.querySelector(".config-player");

let configSetupDiv          = document.getElementById('config-setup');
let configPlayersDropdown   = document.getElementById('config-player-count');
let configSizeDropdown      = document.getElementById('config-size');
let configStartButton       = document.getElementById('config-start');

let gameScoreDiv        = document.getElementById('game-score');
let gameBoardTable      = document.getElementById('game-board');
let gameBoardTbody      = document.getElementById('game-board-tbody');
let gamePlayerTbody     = document.getElementById('game-player-tbody');
let gameRestartButton   = document.getElementById('game-restart');
// end dom elements


class Manager {
    constructor(isRandom) {
        this.isRandom = isRandom;
        this.game = null;
        this.cellRows = [];
        this.scoreRows = [];
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
        let playerCount = parseInt(configPlayersDropdown.value, 10);
        if (playerCount < 1 || playerCount > 4) {
            throw new Error(`expected 1 <= player count <= 4, got ${playerCount}`);
        }
         // TODO get rid of this side communication channel?
        this.players = PlayerEmojis.slice(0, playerCount);
        let size = BoardSizeDimensions(configSizeDropdown.value);
        this.width = size[0];
        this.height = size[1];
        this.faceUpWaitMilliseconds = FaceUpWaitMilliseconds(configSizeDropdown.value);

        console.log(`players: ${this.players}, ${playerCount}, ${this.players.slice(0, playerCount)}`);
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
        this.refreshScoreArea(this.game.getPlayerScores());
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
                cell.textContent = CardBack;
                modelRow.push(cell);
            }
            this.cellRows.push(modelRow);
        }
    }

    refreshScoreArea(players) {
        console.log(`updating score area: ${players}`);
        // this is sloppy: we'll blow away everything, then recreate
        this.scoreRows.forEach(row => row.remove());
        this.scoreRows = [];
        let self = this;

        players.forEach(function(p) {
            let row = gamePlayerTbody.insertRow();
            if (p.isActive) {
                row.classList.add(activePlayerClass);
            }
            row.insertCell().textContent = p.symbol;
            row.insertCell().textContent = p.score;
            self.scoreRows.push(row);
        })
    }

    refreshTurnCount(count) {
        document.getElementById('game-turns').textContent = `Turns: ${count}`;
    }

    updateCardText(cellModel) {
        let x = cellModel.x;
        let y = cellModel.y;
        console.log(`${cellModel}, ${x}, ${y}, ${this.cellRows.length}, ${this.game.board.length}`);
        this.cellRows[y][x].textContent = this.game.board[x][y].domTextContent;
    }

    didChangeGameState(event) {
        console.log(`manager: didChangeGameState to ${JSON.stringify(event)}`);
        event.updateCells.forEach(coord => this.updateCardText(coord));
        this.refreshScoreArea(this.game.getPlayerScores());
        this.refreshTurnCount(this.game.turns.length);
        let self = this;
        switch (event.state) {
            case GameStateMovePart1:
                break;
            case GameStateMovePart2:
                break;
            case GameStateMovePart3:
                console.log(`setting timeout`);
                setTimeout(function() {
                    console.log(`running timeout`);
                    self.game.finishTurn();
                }, this.faceUpWaitMilliseconds);
                // ignore clicks until state change -> move part1
                break;
            case GameStateOver:
                this.setState(ManagerStateOver);
                break;
            default:
                throw new Error(`invalid game state ${state}`);
        }
    }

    setState(state) {
        console.log(`manager: set state to ${state}`);
        switch (state) {
            case ManagerStateConfig:
                setShow(configSetupDiv, true);
                setShow(gameBoardTable, false);
                setShow(gameScoreDiv, false);
                setShow(gameRestartButton, false);
                this.refreshTurnCount(0);
                break;
            case ManagerStateInProgress:
                this.startNewGame(this.width, this.height);
                setShow(configSetupDiv, false);
                setShow(gameBoardTable, true);
                setShow(gameScoreDiv, true);
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

const GameCellStateFaceDown = 'GameCellStateFaceDown';
const GameCellStateFaceUp   = 'GameCellStateFaceUp';
const GameCellStateCaptured = 'GameCellStateCaptured';
const GameCellStateOver     = 'GameCellStateOver';

class GameCell {
    constructor(x, y, char) {
        this.x = x;
        this.y = y;
        this.char = char;
        this.state = GameCellStateFaceDown;
        this.owner = null;
    }

    flipFaceUp() {
        if (this.state !== GameCellStateFaceDown) {
            throw new Error(`unable to flip face up: in state ${this.state}`);
        }
        this.state = GameCellStateFaceUp;
    }

    flipFaceDown() {
        if (this.state !== GameCellStateFaceUp) {
            throw new Error(`unable to flip face down: in state ${this.state}`);
        }
        this.state = GameCellStateFaceDown;
    }

    capture(owner) {
        if (this.state !== GameCellStateFaceUp) {
            throw new Error(`unable to capture: in state ${this.state}`);
        }
        this.state = GameCellStateCaptured;
        this.owner = owner;
    }

    gameOver() {
        if (this.state !== GameCellStateCaptured) {
            throw new Error(`unable to transition to game over: in state ${this.state}`);
        }
        this.state = GameCellStateOver;
    }

    get domTextContent() {
        switch (this.state) {
            case GameCellStateFaceDown: return CardBack;
            case GameCellStateFaceUp: return this.char;
            case GameCellStateCaptured: return '';
            case GameCellStateOver: return this.owner;
            default: throw new Error(`invalid GameCellState ${this.state}`);
        }
    }
}

class Game {
    constructor(width, height, players, isRandom, didChangeState) {
        console.log(`new game: ${width}, ${height}; ${players}; ${isRandom}; ${didChangeState}`);
        this.didChangeState = didChangeState;
        this.playerPairs = players.map(_ => []);
        if (players.length < 1 || players.length > 4) {
            throw new Error(`expected 1 - 4 players, found ${players.length}, ${players}`);
        }
        this.players = players;

        if (!width || width < 1 || !height || height < 1) {
            throw new Error(`invalid width or height: ${width}, ${height}`);
        }
        this.width = width;
        this.height = height;

        this.state = GameStateMovePart1;
        this.nextPlayer = 0;

        let size = width * height;
        if (size % 2 > 0) {
            throw new Error(`invalid size: must be even, got ${size}`);
        }
        let half = size / 2;
        let availableChars = Object.values(FoodEmojis);
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
                this.board[row][col] = new GameCell(row, col, charPairs[i]);
                i++;
            }
        }

        // TODO how to handle these ?  perf optimization ?
        this.faceUp = null;
        this.remainingPairs = half;
        this.turns = [];
    }

    flipCard(x, y) {
        console.log("player %s move to %d, %d", this.nextPlayer, x, y);
        if (!(x >= 0 && x < this.width)) {
            throw new Error("invalid x coordinate: " + x);
        }
        if (!(y >= 0 && y < this.height)) {
            throw new Error("invalid y coordinate: " + y);
        }
        let cell = this.board[x][y];
        if (cell.state !== GameCellStateFaceDown) {
            throw new Error(`already face up or captured: ${x}, ${y}`);
        }

        if (this.state === GameStateMovePart1) {
            cell.flipFaceUp();
            this.faceUp = [cell];
            this.setState({state: GameStateMovePart2, updateCells: [cell]});
        } else if (this.state === GameStateMovePart2) {
            cell.flipFaceUp();
            this.faceUp.push(cell);
            this.setState({state: GameStateMovePart3, updateCells: [cell]});
        } else {
            throw new Error(`cannot move: game not in right state (state: ${this.state})`);
        }
    }

    finishTurn() {
        if (this.state !== GameStateMovePart3) {
            throw new Error(`invalid state to finish turn: ${this.state}`);
        }

        let faceUp = this.faceUp;
        let fst = faceUp[0];
        let snd = faceUp[1];

        this.turns.push({player: this.nextPlayer, cells: this.faceUp, foundPair: fst.char === snd.char});
        let foundPair = null;

        // found a matching pair: add it to the player's pile
        if (fst.char === snd.char) {
            foundPair = {player: this.nextPlayer};
            fst.capture(this.players[this.nextPlayer]);
            snd.capture(this.players[this.nextPlayer]);
            this.playerPairs[this.nextPlayer].push(faceUp);
            this.remainingPairs--;
            // no more cards left: game is over
            if (this.remainingPairs === 0) {
                let cells = this.board.flatMap(row => row);
                cells.forEach(c => c.gameOver());
                this.setState({state: GameStateOver, updateCells: cells, foundPair: foundPair, updatePlayerTurn: null});
                return;
            }
        } else {
            fst.flipFaceDown();
            snd.flipFaceDown();
        }

        this.nextPlayer++;
        if (this.nextPlayer >= this.players.length) {
            this.nextPlayer = 0;
        }
        this.faceUp = null;

        this.setState({state: GameStateMovePart1, updateCells: faceUp, foundPair: foundPair, updatePlayerTurn: this.nextPlayer});
        console.log(`continuing game, switching to player ${this.nextPlayer}`);
    }

    setState(event) {
        console.log(`game: set state to ${event}\n${this.toPrettyString()}`);
        this.state = event.state;
        this.didChangeState(event);
    }

    getPlayerScores() {
        return this.players.map((p, ix) => {
            return {
                'symbol': p,
                'isActive': ix === this.nextPlayer,
                'score': this.playerPairs[ix].length,
            };
        });
    }

    isValid() {
        let counts = new Map();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let c = this.board[x][y].char;
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
                let s = this.board[x][y].domTextContent;
                row.push(`[${s ? s : ' '}, ${this.board[x][y].char}]`);
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
    let board = new Game(2, 2, ["X", "O"], false, (state) => console.log(`didChangeState: ${state}`));

    console.log(board.toPrettyString());
    console.log(`is valid? ${board.isValid()}`);

    board.flipCard(0, 0);
    board.debugDump();

    board.flipCard(1, 0);
    board.debugDump();

    board.setState(GameStateMovePart1);

    board.flipCard(0, 1);
    board.debugDump();

    board.flipCard(1, 1);
    board.debugDump();

    // board.flipCard(0, 1);
    // board.debugDump();

    // board.flipCard(1, 1);
    // board.debugDump();

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

if (false) { // TODO
    runTests();
}
// // end tests



// // DOM manipulation
let manager = new Manager(true);

let didClickConfigStart = () => {
    console.log('start clicked! %s', configPlayersDropdown.value);
    manager.didClickStart();
};
configStartButton.addEventListener('click', didClickConfigStart);

let didClickGameRestart = () => {
    console.log('restart clicked!');
    manager.didClickRestart();
};
gameRestartButton.addEventListener('click', didClickGameRestart);
