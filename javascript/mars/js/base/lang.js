'use strict'

const MarsLang = {

    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    confirm: 'Confirm',
    error: 'Error',
    warning: 'Warning',
    notification: 'Notification',
    message: 'Message',
    ajax_error: 'An error occurred while processing the request: {error}',
    ajax_content_error: 'An error occurred while processing the request. The response did not contain valid content.',

    /**
     * Returns a string from the language object, replacing placeholders with actual values.
     * @param {string} key The key of the string to retrieve
     * @param {object} [replacements=null] An object containing key-value pairs for placeholders to replace in the string.
     * @returns {string} The string with placeholders replaced, or the key itself if not found
     */
    get: function (key, replacements = null) {
        let str = this[key] ?? key;
        if (!replacements) {
            return str;
        }

        // Replace placeholders with actual values
        for (let [search, value] of Object.entries(replacements)) {
            str = str.replaceAll(`{${search}}`, value);
        }

        return str;
    }
}

mars.define('lang', () => MarsLang);