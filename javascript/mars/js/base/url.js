'use strict'

class MarsUrl {
    
    /**
     * Checks if a url is a valid URL
     * @param {string} url The url to check
     * @return {boolean} True if the string is a valid URL, false otherwise
     */
    is (url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
}

mars.define('url', () => new MarsUrl);