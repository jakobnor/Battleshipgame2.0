let currentLanguage = 'en';

function setLanguage(lang) {
    currentLanguage = lang;
}

function getLanguage() {
    return currentLanguage;
}

export { setLanguage, getLanguage };
