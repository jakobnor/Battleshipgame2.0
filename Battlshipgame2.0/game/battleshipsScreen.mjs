import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { getLanguage } from '../language.mjs';
import messages from '../localization.mjs';
import createEndScreen from "./endScreen.mjs";

ANSI.SEA__AND_SHIP = '\x1b[38;5;83;48;5;39m';
ANSI.SEA = '\x1b[48;5;39m';

function createGameBoard(map) {
    return {
        ships: map,
        target: Array.from({ length: GAME_BOARD_DIM }, () => Array(GAME_BOARD_DIM).fill(0))
    };
}

const createBattleshipScreen = () => {

    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = null;
    let secondPlayerBoard = null;
    let currentBoard = null;
    let opponentBoard = null;
    let cursorRow = 0;
    let cursorColumn = 0;

    function swapPlayer() {
        currentPlayer *= -1;
        if (currentPlayer == FIRST_PLAYER) {
            currentBoard = firstPlayerBoard;
            opponentBoard = secondPlayerBoard;
        } else {
            currentBoard = secondPlayerBoard;
            opponentBoard = firstPlayerBoard;
        }
    }

    function checkForWin(board) {
        for (let row = 0; row < GAME_BOARD_DIM; row++) {
            for (let col = 0; col < GAME_BOARD_DIM; col++) {
                if (board.ships[row][col] !== 0 && board.target[row][col] !== 'X') {
                    return false;
                }
            }
        }
        return true;
    }

    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        init: function (firstPMap, secondPMap) {
            firstPlayerBoard = createGameBoard(firstPMap);
            secondPlayerBoard = createGameBoard(secondPMap);
            swapPlayer();
        },

        update: function (dt) {
            if (KeyBoardManager.isUpPressed()) {
                cursorRow = Math.max(0, cursorRow - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                cursorRow = Math.min(GAME_BOARD_DIM - 1, cursorRow + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isLeftPressed()) {
                cursorColumn = Math.max(0, cursorColumn - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isRightPressed()) {
                cursorColumn = Math.min(GAME_BOARD_DIM - 1, cursorColumn + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isEnterPressed()) {
                if (opponentBoard.target[cursorRow][cursorColumn] === 0) {
                    const cell = opponentBoard.ships[cursorRow][cursorColumn];
                    if (cell !== 0) {
                        opponentBoard.target[cursorRow][cursorColumn] = 'X'; 
                    } else {
                        opponentBoard.target[cursorRow][cursorColumn] = 'O'; 
                    }
                    if (checkForWin(opponentBoard)) {
                        let endScreen = createEndScreen(currentPlayer);
                        this.next = endScreen;
                        this.transitionTo = "Game Over";
                    } else {
                        swapPlayer();
                        cursorRow = 0;
                        cursorColumn = 0;
                        this.isDrawn = false;
                    }
                }
            }
        },

        draw: function (dr) {
            if (this.isDrawn) return;
            this.isDrawn = true;

            clearScreen();

            const currentLanguage = getLanguage();

            let output = `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${messages[currentLanguage]['player_turn'].replace('{player}', currentPlayer === FIRST_PLAYER ? '1' : '2')}\n\n${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}`;

            output += `${messages[currentLanguage]['opponent_board']}\n`;
            output += renderBoard(opponentBoard.target, true);

            output += `\n${messages[currentLanguage]['your_board']}\n`;
            output += renderBoard(currentBoard.ships, false);

            print(output);
        }
    };

    function renderBoard(board, isTargetBoard) {
        let boardString = '  ';
        for (let i = 0; i < GAME_BOARD_DIM; i++) {
            boardString += ` ${String.fromCharCode(65 + i)}`;
        }
        boardString += '\n';

        for (let y = 0; y < GAME_BOARD_DIM; y++) {
            boardString += `${String(y + 1).padStart(2, ' ')} `;
            for (let x = 0; x < GAME_BOARD_DIM; x++) {
                let cell = board[y][x];
                let displayChar = ' ';
                let color = ANSI.SEA;

                if (isTargetBoard) {
                    if (cursorRow === y && cursorColumn === x) {
                        color = ANSI.COLOR.WHITE;
                    }
                    if (cell === 'X') {
                        displayChar = 'X';
                        color = ANSI.COLOR.RED;
                    } else if (cell === 'O') {
                        displayChar = 'O';
                        color = ANSI.COLOR.BLUE;
                    }
                } else {
                    if (cell !== 0) {
                        displayChar = cell;
                        color = ANSI.SEA__AND_SHIP;
                    } else {
                        color = ANSI.SEA;
                    }
                }

                boardString += `${color}${displayChar}${ANSI.RESET} `;
            }
            boardString += `${y + 1}\n`;
        }

        boardString += '  ';
        for (let i = 0; i < GAME_BOARD_DIM; i++) {
            boardString += ` ${String.fromCharCode(65 + i)}`;
        }
        boardString += '\n';

        return boardString;
    }
};

export default createBattleshipScreen;
