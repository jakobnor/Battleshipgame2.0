const ESC = '\x1b';
const CSI = ESC + '[';
const BOLD = CSI + '1m';
const BOLD_OFF = CSI + '22m';
const CURSOR_UP = CSI + 'A';
const CURSOR_DOWN = CSI + 'B';
const CURSOR_RIGHT = CSI + 'C';
const CURSOR_LEFT = CSI + 'D';
const CLEAR_SCREEN = CSI + '2J';
const DELETE_SCREEN = CSI + '3J';
const CURSOR_HOME = CSI + '1;1H';
const RESET = '\x1b[0m';
const HIDE_CURSOR = '\u001B[?25l';
const SHOW_CURSOR = '\u001B[?25h';

const moveCursorTo = (row, col) => CSI + row + ';' + col + 'H';

const ANSI = {
    ESC,
    CSI,
    CURSOR_UP,
    CURSOR_DOWN,
    CURSOR_RIGHT,
    CURSOR_LEFT,
    HIDE_CURSOR,
    SHOW_CURSOR,
    CLEAR_SCREEN,
    DELETE_SCREEN,
    CURSOR_HOME,
    RESET,
    moveCursorTo,
    COLOR_RESET: RESET,
    COLOR: {
        GREEN: '\x1b[32m',
        RED: '\x1b[31m',
        YELLOW: '\x1b[33m',
        BLUE: '\x1b[34m',
        BLACK: '\x1b[30m',
        WHITE: '\x1b[37m',
    },
    BACKGROUND_COLOR: {
        GREEN: '\x1b[42m',
        RED: '\x1b[41m',
        YELLOW: '\x1b[43m',
        BLUE: '\x1b[44m'
    },
    TEXT: {
        BOLD,
        BOLD_OFF
    }
};

export { ANSI };
