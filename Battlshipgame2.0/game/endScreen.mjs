import { print, clearScreen } from "../utils/io.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { getLanguage } from '../language.mjs';
import messages from '../localization.mjs';
import createMenu from "../utils/menu.mjs";
import { buildMenu } from '../game.mjs';
import KeyBoardManager from "../utils/io.mjs";
import { FIRST_PLAYER } from "../consts.mjs";

function createEndScreen(winnerPlayer) {
    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        init: function () {
            this.isDrawn = false;
            this.next = null;
            this.transitionTo = null;
        },

        update: function (dt) {
            
            if (KeyBoardManager.isEnterPressed()) {
                let mainMenuScene = createMenu(buildMenu());
                this.next = mainMenuScene;
                this.transitionTo = "Main Menu";
            }
        },

        draw: function (dr) {
            if (this.isDrawn) return;
            this.isDrawn = true;

            clearScreen();

            const currentLanguage = getLanguage();

            let output = `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}${messages[currentLanguage]['game_over']}\n\n${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}`;
            output += messages[currentLanguage]['player_wins'].replace('{player}', winnerPlayer === FIRST_PLAYER ? '1' : '2') + '\n';
            output += `\n${messages[currentLanguage]['press_enter_return']}\n`;

            print(output);
        }
    };
}

export default createEndScreen;
