import { ANSI } from "../utils/ansi.mjs";
import KeyBoardManager, { clearScreen } from "../utils/io.mjs";
import { print, printCenterd } from "../utils/io.mjs";

function createMenu(menuItems) {
    let currentActiveMenuItem = 0;

    return {
        isDrawn: false,
        next: null,
        transitionTo: null,

        update: function (dt) {
            if (KeyBoardManager.isUpPressed()) {
                currentActiveMenuItem--;
                if (currentActiveMenuItem < 0) {
                    currentActiveMenuItem = 0;
                }
                this.isDrawn = false;
            }
            else if (KeyBoardManager.isDownPressed()) {
                currentActiveMenuItem++;
                if (currentActiveMenuItem >= menuItems.length) {
                    currentActiveMenuItem = menuItems.length - 1;
                }
                this.isDrawn = false;
            }
            else if (KeyBoardManager.isEnterPressed()) {
                if (menuItems[currentActiveMenuItem].action) {
                    menuItems[currentActiveMenuItem].action();
                }
            }
        },

        draw: function () {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                clearScreen();
                let output = "";

                for (let index in menuItems) {
                    let menuItem = menuItems[index];

                    let title = menuItem.text;
                    if (currentActiveMenuItem == menuItem.id) {
                        title = `${ANSI.COLOR.GREEN}> ${menuItem.text}${ANSI.RESET}`;
                    } else {
                        title = `  ${menuItem.text}`;
                    }

                    output += title + "\n";
                }

                printCenterd(output);

            }
        }

    };
}

export default createMenu;
