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
const PlayerColors = shuffle([
    'lightcyan',
    'lightblue',
    'lightgray',
    'lightgreen',
    'lightyellow',
    'lightpink',
    'lightcoral',
    'lightseagreen'
]);

const PlayerEmojis = shuffle(Object.values(PeopleEmojis));

const FaceUpWaitMilliseconds = 1000;

const BoardSizeSmall    = 'small';
const BoardSizeMedium   = 'medium';
const BoardSizeLarge    = 'large';
const BoardSizeXL       = 'xl';

function BoardSizeDimensions(boardSize, matchSize) {
    if (matchSize < 2 || matchSize > 6) {
        throw new Error(`invalid match size ${matchSize}`);
    }
    switch (boardSize) {
        case BoardSizeSmall:
            switch (matchSize) {
                case 5:
                    return [5, 3];
                default:
                    return [4, 3];
            }
        case BoardSizeMedium:
            switch (matchSize) {
                case 5:
                    return [7, 5];
                default:
                    return [9, 4];
            }
        case BoardSizeLarge:
            switch (matchSize) {
                case 5:
                    return [14, 5];
                default:
                    return [12, 6];
            }
        case BoardSizeXL:
            switch (matchSize) {
                case 3:
                case 6:
                    return [12, 9];
                case 5:
                    return [15, 7];
                default:
                    return [14, 8];
            }
        default: throw new Error(`invalid board size ${boardSize}`);
    }
}

const ManagerStateConfig        = 'managerstate: config';
const ManagerStateInProgress    = 'managerstate: in progress';
const ManagerStateOver          = 'managerstate: over';

const GameStateMove   = 'gamestate: move';
const GameStateFaceUp = 'gamestate: face up';
const GameStateOver   = 'gamestate: over';

const boardCellClass    = 'game-board-cell';
const boardHeaderClass  = 'game-board-header';
const activePlayerClass = 'game-active-player';
// end constants


// dom elements
const playerElements      = document.querySelector(".config-player");

const configSetupDiv          = document.getElementById('config-setup');
const configPlayersDropdown   = document.getElementById('config-player-count');
const configSizeDropdown      = document.getElementById('config-size');
const configMatchSizeDropdown = document.getElementById('config-match-size');
const configThemeDropdown     = document.getElementById('config-theme');
const configStartButton       = document.getElementById('config-start');

const gameScoreDiv        = document.getElementById('game-score');
const gameBoardTable      = document.getElementById('game-board');
const gameBoardTbody      = document.getElementById('game-board-tbody');
const gamePlayerTbody     = document.getElementById('game-player-tbody');
const gameRestartButton   = document.getElementById('game-restart');
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
        if (this.state !== ManagerStateInProgress) {
            console.log(`ignoring cell click, manager not in proper state`);
            return;
        }
        this.game.flipCard(x, y);
    }

    didClickStart() {
        console.log("manager: start");
        if (this.state !== ManagerStateConfig) {
            throw new Error(`unable to start: in state ${this.state}`);
        }
        const playerCount = parseInt(configPlayersDropdown.value, 10);
        if (playerCount < 1 || playerCount > 6) {
            throw new Error(`expected 1 <= player count <= 6, got ${playerCount}`);
        }
         // TODO get rid of this side communication channel?
        this.players = PlayerEmojis.slice(0, playerCount);
        this.matchSize = parseInt(configMatchSizeDropdown.value, 10);
        const size = BoardSizeDimensions(configSizeDropdown.value, this.matchSize);
        this.width = size[0];
        this.height = size[1];
        this.cardCharacters = GetCharacters(configThemeDropdown.value);

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

    startNewGame() {
        if (this.state !== ManagerStateConfig) {
            throw new Error(`unable to start game from state ${this.state}`);
        }
        this.game = new Game(
            this.width,
            this.height,
            this.players,
            this.isRandom,
            this.cardCharacters,
            (gameState) => this.didChangeGameState(gameState),
            this.matchSize);
        this.setUpTable();
        this.refreshScoreArea(this.game.getPlayerScores());
    }

    setUpTable() {
        const xCount = this.width;
        const yCount = this.height;
        // 1. clear out old table children
        // 2. create new table children
        // 3. add listeners

        // TODO is this explicit removal necessary?
        this.cellRows.forEach(row => row.forEach(e => e.remove()));

        gameBoardTbody.textContent = '';
        this.cellRows = [];

        // special row of cells showing x half of coordinate; doesn't need to be updated
        //   so no need to add to model
        let headerRow = gameBoardTbody.insertRow();
        for (let x = 0; x <= xCount; x++) {
            let headerRowCell = headerRow.insertCell();
            if (x === 0) { continue; }
            headerRowCell.textContent = x - 1;
            headerRowCell.classList.add(boardHeaderClass);
        }

        let self = this;
        for (let y = 0; y < yCount; y++) {
            let domRow = gameBoardTbody.insertRow();
            let modelRow = [];
            
            // special cell showing y half of coordinate; doesn't need to be updated
            //   so no need to add to model
            let headerColumnCell = domRow.insertCell();
            headerColumnCell.textContent = String.fromCharCode(y + 'A'.charCodeAt());
            headerColumnCell.classList.add(boardHeaderClass);

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
            if (p.hasBorder) {
                row.classList.add(activePlayerClass);
            }
            row.style.background = p.backgroundColor;
            row.insertCell().textContent = p.symbol;
            row.insertCell().textContent = p.score;
            self.scoreRows.push(row);
        })
    }

    refreshTurnCount(count) {
        document.getElementById('game-turns').textContent = `Turns: ${count}`;
    }

    updateCardText(cellModel) {
        console.log(`update card text ${JSON.stringify(cellModel)}`);
        const x = cellModel.x;
        const y = cellModel.y;
        this.cellRows[y][x].textContent = this.game.board[x][y].domTextContent;
        this.cellRows[y][x].style.background = this.game.board[x][y].backgroundColor;
        this.cellRows[y][x].style.color = this.game.board[x][y].color;
    }

    didChangeGameState(event) {
        console.log(`manager: didChangeGameState to ${JSON.stringify(event)}`);
        event.updateCells.forEach(coord => this.updateCardText(coord));
        this.refreshScoreArea(this.game.getPlayerScores());
        this.refreshTurnCount(this.game.turns.length);
        switch (event.state) {
            case GameStateMove:
                break;
            case GameStateFaceUp:
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
                this.startNewGame();
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
        this.ownerColor = null;
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

    capture(ownerColor) {
        if (this.state !== GameCellStateFaceUp) {
            throw new Error(`unable to capture: in state ${this.state}`);
        }
        this.state = GameCellStateCaptured;
        this.ownerColor = ownerColor;
    }

    gameOver() {
        if (this.state !== GameCellStateCaptured) {
            throw new Error(`unable to transition to game over: in state ${this.state}`);
        }
        this.state = GameCellStateOver;
    }

    get backgroundColor() {
        switch (this.state) {
            case GameCellStateFaceDown: return '';
            case GameCellStateFaceUp:   return '';
            case GameCellStateCaptured: return this.ownerColor;
            case GameCellStateOver:     return this.ownerColor;
            default: throw new Error(`invalid GameCellState ${this.state}`);
        }
    }

    get color() {
        switch (this.state) {
            case GameCellStateFaceDown: return 'black';
            case GameCellStateFaceUp:   return this.char.color;
            case GameCellStateCaptured: return 'black';
            case GameCellStateOver:     return this.char.color;
            default: throw new Error(`invalid GameCellState ${this.state}`);
        }
    }

    get domTextContent() {
        switch (this.state) {
            case GameCellStateFaceDown: return CardBack;
            case GameCellStateFaceUp:   return this.char.value;
            case GameCellStateCaptured: return '';
            case GameCellStateOver:     return this.char.value;
            default: throw new Error(`invalid GameCellState ${this.state}`);
        }
    }
}

class Game {
    constructor(width, height, players, isRandom, cardCharacters, didChangeState, matchSize) {
        console.log(`new game: ${width}, ${height}; ${players}; ${isRandom}; ${didChangeState}`);
        this.didChangeState = didChangeState;
        this.playerSets = players.map(_ => []);
        this.players = players;

        if (!width || width < 1 || !height || height < 1) {
            throw new Error(`invalid width or height: ${width}, ${height}`);
        }
        this.width = width;
        this.height = height;
        this.matchSize = matchSize;

        this.state = GameStateMove;
        this.nextPlayer = 0;

        const size = width * height;
        if (size % matchSize > 0) {
            throw new Error(`invalid size: must divisible by ${matchSize}, got ${size}`);
        }
        const setsCount = size / matchSize;
        let availableChars = Object.values(cardCharacters);
        if (isRandom) {
            availableChars = shuffle(availableChars);
        }
        if (setsCount > availableChars.length) {
            throw new Error(`game board too large: need ${size}, max chars is ${availableChars.length * matchSize}`);
        }
        let chars = [];
        for (let i = 0; i < matchSize; i++) {
            chars = chars.concat(availableChars.slice(0, setsCount));
        }
        if (isRandom) {
            chars = shuffle(chars);
        }
        this.board = Array(width).fill(null).map(x => Array(height).fill(null));
        let i = 0;
        for (let row = 0; row < width; row++) {
            for (let col = 0; col < height; col++) {
                this.board[row][col] = new GameCell(row, col, chars[i]);
                i++;
            }
        }

        // TODO how to handle these ?  perf optimization ?
        this.faceUp = [];
        this.remainingSetsCount = setsCount;
        this.turns = [];
    }

    flipCard(x, y) {
        if (this.state !== GameStateMove) {
            throw new Error(`can not flip card at ${x}, ${y} -- in state ${this.state}`)
        }
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

        if (this.state === GameStateMove) {
            cell.flipFaceUp();
            this.faceUp.push(cell);
            if (this.faceUp.length < this.matchSize) {
                this.didChangeState({state: this.state, updateCells: [cell]});
            } else {
                this.state = GameStateFaceUp;
                this.didChangeState({state: this.state, updateCells: [cell]});
                console.log(`setting timeout to capture set or flip cards back to face down`);
                const self = this;
                setTimeout(function() {
                    console.log(`running capture/flip timeout`);
                    self.finishTurn();
                }, FaceUpWaitMilliseconds);
                // ignore clicks until state has changed back to move part1
            }
        } else {
            throw new Error(`cannot move: game not in right state (state: ${this.state})`);
        }
        console.log(`flip card, state is ${this.state}\n${this.toPrettyStringUser()}\n${this.toPrettyStringCard()}`);
    }

    finishTurn() {
        if (this.state !== GameStateFaceUp) {
            throw new Error(`invalid state to finish turn: ${this.state}`);
        }

        let faceUp = this.faceUp;
        let isComplete = true;
        for (let i = 1; i < this.faceUp.length; i++) {
            if (this.faceUp[i].char !== this.faceUp[0].char) {
                isComplete = false;
                break;
            }
        }

        this.turns.push({player: this.nextPlayer, cells: this.faceUp, foundSet: isComplete});

        // found a matching set: add it to the player's pile
        if (isComplete) {
            this.faceUp.forEach((card) => card.capture(PlayerColors[this.nextPlayer]));
            this.playerSets[this.nextPlayer].push(faceUp);
            this.remainingSetsCount--;
            // no more cards left: game is over
            if (this.remainingSetsCount === 0) {
                let cells = this.board.flatMap(row => row);
                cells.forEach(c => c.gameOver());
                this.state = GameStateOver;
                this.didChangeState({state: this.state, updateCells: cells});
                console.log(`game: set state to ${this.state}\n${this.toPrettyStringUser()}\n${this.toPrettyStringCard()}`);
                return;
            }
        } else {
            // only switch players if guess is wrong
            this.nextPlayer++;
            if (this.nextPlayer >= this.players.length) {
                this.nextPlayer = 0;
            }
            this.faceUp.forEach((card) => card.flipFaceDown());
        }

        this.faceUp = [];

        console.log(`game: set state to ${this.state}\n${this.toPrettyStringUser()}\n${this.toPrettyStringCard()}`);
        this.state = GameStateMove;
        this.didChangeState({state: this.state, updateCells: faceUp});
        console.log(`continuing game, player ${this.nextPlayer}'s turn`);
    }

    getPlayerScores() {
        let maxScore = Math.max(...this.players.map((p, ix) => this.playerSets[ix].length ));
        return this.players.map((p, ix) => {
            return {
                'symbol'        : p,
                'backgroundColor': PlayerColors[ix],
                'hasBorder'     : (this.state !== GameStateOver) ? ix === this.nextPlayer : (this.playerSets[ix].length === maxScore),
                'score'         : this.playerSets[ix].length,
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

    toPrettyStringCard() {
        let rows = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                const item = this.board[x][y];
                const s = item.domTextContent;
                row.push(`[${item.char.value}, ${item.char.color}]`);
            }
            rows.push(row.join(" "));
        }
        return rows.join("\n");
    }

    toPrettyStringUser() {
        let rows = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                const item = this.board[x][y];
                const s = item.domTextContent;
                // console.log doesn't seem to print monospace with these fancy emojis,
                // so in lieu of figuring out how to do that cross-browser, just throw
                // in two spaces because that's sort of close
                row.push(s ? s : '  ');
            }
            rows.push(row.join(" "));
        }
        return rows.join("\n");
    }

    toPrettyString() {
        let rows = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                const item = this.board[x][y];
                const s = item.domTextContent;
                row.push(`[${s ? s : ' '}, ${item.char.value}, ${item.char.color}]`);
            }
            rows.push(row.join(" "));
        }
        return rows.join("\n");
    }

    debugDump() {
        console.log(JSON.stringify({
            next: this.nextPlayer,
            sets: this.playerSets,
            faceUp: this.faceUp,
            state: this.state,
        }));
        console.log(this.toPrettyString());
    }
}
// end model


// // tests
function runTests() {
    let board = new Game(2, 2, ["X", "O"], false, FoodEmojis, (state) => console.log(`didChangeState: ${state}`));

    console.log(board.toPrettyString());
    console.log(`is valid? ${board.isValid()}`);

    board.flipCard(0, 0);
    board.debugDump();

    board.flipCard(1, 0);
    board.debugDump();

    board.setState(GameStateMove);

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

function printCharacters() {
    let pre = document.createElement("pre");
    configSetupDiv.appendChild(pre);
    for (const [key, value] of Object.entries(GetCharacters(MixedTheme))) {
        console.log(`${key}: ${value}`);
        pre.textContent += `${key}: ${value}\n`;
    }
}

if (false) { // TODO
    // runTests();
    printCharacters();
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
