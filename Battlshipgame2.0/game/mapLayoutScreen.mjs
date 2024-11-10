
import { GAME_BOARD_DIM } from "../consts.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import units from "./units.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { create2DArrayWithFill } from "../utils/array.mjs";
import { getLanguage } from '../language.mjs';
import messages from '../localization.mjs';

ANSI.SEA__AND_SHIP = '\x1b[38;5;83;48;5;39m';
ANSI.SEA = '\x1b[48;5;39m';

function createMapLayoutScreen() {

    return {
        player: null,
        isDrawn: false,
        next: null,
        transitionTo: null,
        cursorColumn: 0,
        cursorRow: 0,
        currentShipIndex: 0,
        isHorizontal: false,
        map: create2DArrayWithFill(GAME_BOARD_DIM),
        ships: [...Object.values(units)],
        placedShips: [],
        transitionFn: null,

        init: function (player, transitionFn) {
            this.player = player;
            this.transitionFn = transitionFn;
            this.map = create2DArrayWithFill(GAME_BOARD_DIM);
            this.currentShipIndex = 0;
            this.cursorColumn = 0;
            this.cursorRow = 0;
            this.isHorizontal = false;
            this.isDrawn = false;
            this.next = null;
            this.transitionTo = null;
        },

        canPlaceShip: function () {
            const ship = this.ships[this.currentShipIndex];
            const size = ship.size;

            if (this.isHorizontal) {
                if (this.cursorColumn + size > GAME_BOARD_DIM) {
                    return false;
                }
            } else {
                if (this.cursorRow + size > GAME_BOARD_DIM) {
                    return false;
                }
            }

            for (let i = 0; i < size; i++) {
                const column = this.isHorizontal ? this.cursorColumn + i : this.cursorColumn;
                const row = this.isHorizontal ? this.cursorRow : this.cursorRow + i;
                if (this.map[row][column] !== 0) {
                    return false;
                }
            }

            return true;
        },

        placeShip: function () {
            const ship = this.ships[this.currentShipIndex];
            for (let i = 0; i < ship.size; i++) {
                const column = this.isHorizontal ? this.cursorColumn + i : this.cursorColumn;
                const row = this.isHorizontal ? this.cursorRow : this.cursorRow + i;
                this.map[row][column] = ship.symbole;
            }

            this.placedShips.push({
                ...ship,
                x: this.cursorColumn,
                y: this.cursorRow,
                isHorizontal: this.isHorizontal
            });

        },

        isPositionInShipPreview: function (column, row) {
            if (this.currentShipIndex >= this.ships.length) return false;

            const ship = this.ships[this.currentShipIndex];
            if (this.isHorizontal) {
                return row === this.cursorRow &&
                    column >= this.cursorColumn &&
                    column < this.cursorColumn + ship.size;
            } else {
                return column === this.cursorColumn &&
                    row >= this.cursorRow &&
                    row < this.cursorRow + ship.size;
            }
        },

        update: function (dt) {

            if (KeyBoardManager.isUpPressed()) {
                this.cursorRow = Math.max(0, this.cursorRow - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                this.cursorRow = Math.min(GAME_BOARD_DIM - 1, this.cursorRow + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isLeftPressed()) {
                this.cursorColumn = Math.max(0, this.cursorColumn - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isRightPressed()) {
                this.cursorColumn = Math.min(GAME_BOARD_DIM - 1, this.cursorColumn + 1);
                this.isDrawn = false;
            }

            if (KeyBoardManager.isRotatePressed()) {
                this.isHorizontal = !this.isHorizontal;
                this.isDrawn = false;
            }

            if (KeyBoardManager.isEnterPressed() && this.currentShipIndex < this.ships.length) {
                this.isDrawn = false;
                if (this.canPlaceShip()) {
                    this.placeShip();
                    this.currentShipIndex++;
                    this.cursorColumn = 0;
                    this.cursorRow = 0;
                    if (this.currentShipIndex < this.ships.length) {
                        
                    } else {
                        this.next = this.transitionFn(this.map);
                        this.transitionTo = "next state";
                    }

                }
            }
        },

        draw: function (dr) {

            if (this.isDrawn == true) { return; }  
            this.isDrawn = true;

            clearScreen();

            const currentLanguage = getLanguage();

            let output = `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${messages[currentLanguage]['ship_placement_phase']}\n\n${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}`;

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`; 
            }
            output += '\n';

            for (let y = 0; y < GAME_BOARD_DIM; y++) {

                output += `${String(y + 1).padStart(2, ' ')} `;

                for (let x = 0; x < GAME_BOARD_DIM; x++) {
                    const cell = this.map[y][x];
                    const isInShipPreview = this.isPositionInShipPreview(x, y);

                    if (isInShipPreview && this.canPlaceShip()) {
                        
                        output += ANSI.COLOR.GREEN + '█' + ANSI.RESET + ' ';
                    } else if (isInShipPreview) {
                         
                        output += ANSI.COLOR.WHITE + '█' + ANSI.RESET + ' ';
                    }
                    else if (cell !== 0) {
                        
                        output += ANSI.SEA__AND_SHIP + cell + ANSI.RESET + ' ';
                    } else {
                        
                        output += ANSI.SEA + ' ' + ANSI.RESET + ' ';
                    }
                }
                output += `${y + 1}\n`;
            }

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n\n';

            output += `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${messages[currentLanguage]['controls']}${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}\n`;
            output += `${messages[currentLanguage]['arrow_keys_move']}\n`;
            output += `${messages[currentLanguage]['r_rotate']}\n`;
            output += `${messages[currentLanguage]['enter_place_ship']}\n`;

            output += `\n${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${messages[currentLanguage]['ships_to_place']}${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}\n`;
            this.ships.forEach((ship, index) => {
                const status = index < this.currentShipIndex ? '✓' :
                    index === this.currentShipIndex ? '>' : ' ';
                output += `${status} ${ship.id} (${ship.size} spaces)\n`;
            });

            print(output);
        }
    };
}

export default createMapLayoutScreen;
