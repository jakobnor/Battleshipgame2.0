import { ANSI } from "./utils/ansi.mjs";
import { print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { setLanguage, getLanguage } from './language.mjs';
import messages from './localization.mjs';

const MIN_COLUMNS = 80;
const MIN_ROWS = 24;

const GAME_FPS = 1000 / 60;
let currentState = null;
let gameLoop = null;

let mainMenuScene = null;
let languageMenuScene = null;

(function initialize() {
    if (process.stdout.columns < MIN_COLUMNS || process.stdout.rows < MIN_ROWS) {
        print(`Error: Terminal size is too small. Please resize your terminal window to at least ${MIN_COLUMNS} columns and ${MIN_ROWS} rows.\n`);
        process.exit();
    }
    print(ANSI.HIDE_CURSOR);
    clearScreen();
    languageMenuScene = createMenu(buildLanguageMenu());
    SplashScreen.next = languageMenuScene;
    currentState = SplashScreen;
    gameLoop = setInterval(update, GAME_FPS);
})();

function update() {
    currentState.update(GAME_FPS);
    currentState.draw(GAME_FPS);
    if (currentState.transitionTo != null) {
        currentState = currentState.next;
        print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
    }
}


function buildLanguageMenu() {
    let menuItemCount = 0;
    return [
        {
            text: 'English', id: menuItemCount++, action: function () {
                setLanguage('en');
                mainMenuScene = createMenu(buildMenu());
                currentState.next = mainMenuScene;
                currentState.transitionTo = "Main Menu";
            }
        },
        {
            text: 'Norsk', id: menuItemCount++, action: function () {
                setLanguage('no');
                mainMenuScene = createMenu(buildMenu());
                currentState.next = mainMenuScene;
                currentState.transitionTo = "Hovedmeny";
            }
        }
    ];
}

function buildMenu() {
    let menuItemCount = 0;
    const currentLanguage = getLanguage();
    return [
        {
            text: messages[currentLanguage]['start_game'], id: menuItemCount++, action: function () {
                clearScreen();
                let innBetween = createInnBetweenScreen();
                innBetween.init(messages[currentLanguage]['ship_placement_first_player'], () => {

                    let p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {

                        let innBetween = createInnBetweenScreen();
                        innBetween.init(messages[currentLanguage]['ship_placement_second_player'], () => {
                            let p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                let battleScreen = createBattleshipScreen();
                                battleScreen.init(player1ShipMap, player2ShipMap);
                                return battleScreen;
                            });
                            return p2map;
                        });
                        return innBetween;
                    });
                    return p1map;

                }, 3);
                currentState.next = innBetween;
                currentState.transitionTo = "Map layout";
            }
        },
        {
            text: messages[currentLanguage]['exit_game'], id: menuItemCount++, action: function () {
                print(ANSI.SHOW_CURSOR);
                clearScreen();
                process.exit();
            }
        },
    ];
}

export { buildMenu };
