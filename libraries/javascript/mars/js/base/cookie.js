'use strict'

class MarsCookie {

    /**
    * Reads the value of a cookie
    * @param {string} name The name of the cookie
    * @return {string|null} The cookie's value
    */
    get (name) {
        if (!document.cookie) {
            return null;
        }

        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }

        return null;
    }

    /**
    * Writes a cookie
    * @param {string} name The cookie's name
    * @param {string} value The cookie's value
    * @param {number} days The number of days in which the cookie is valid
    * @param {string} path The cookie's path
    * @param {string} domain The cookie's domain
    * @param {boolean} secure Whether the cookie is secure
    * @param {string} sameSite The cookie's SameSite attribute (e.g. 'Strict', 'Lax', 'None')
    * @return {this}
    */
    set (name, value, days = null, path = null, domain = null, secure = false, sameSite = null) {
        const parts = [];

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 3600 * 1000));

            parts.push('expires=' + date.toUTCString());
        }

        if (path) {
            parts.push('path=' + path);
        }

        if (domain) {
            parts.push('domain=' + domain);
        }

        if (sameSite) {
            parts.push('SameSite=' + sameSite);

            // if SameSite is None, the cookie must be secure
            if (sameSite.toLowerCase() == 'none') {
                secure = true;
            }
        }

        if (secure) {
            parts.push('Secure');
        }

        let cookie = name + '=' + encodeURIComponent(value);
        if (parts.length) {
            cookie += '; ' + parts.join('; ');
        }

        document.cookie = cookie;

        return this;
    }

    /**
    * Deletes a cookie
    * @param {string} name The name of the cookie to unset
    * @param {string} path The cookie's path
    * @param {string} domain The cookie's domain
    * @return {this}
    */
    delete (name, path = null, domain = null) {
        this.set(name, '', -1, path, domain);

        return this;
    }
    
}

mars.define('cookie', () => new MarsCookie);
