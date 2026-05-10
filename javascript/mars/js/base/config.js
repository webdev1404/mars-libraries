'use strict'

class MarsConfig {

    /**
     * The config data
     * @protected
     * @type {object}
     */
    data = {};

    constructor () {
        if (window.MarsConfigData) {
            this.data = mars.json.decode(window.MarsConfigData);
        }
    }

    /**
     * Gets a config value
     * @param {string} key The key of the config value to get
     * @return {string|null} The config value or null if it does not exist
     */
    get (key) {
        return this.data[key] ?? null;
    }

    /**
     * Sets a config value
     * @param {string} key The key of the config value to set
     * @param {string} value The value of the config value to set
     */
    set (key, value) {
        this.data[key] = value;
    }

}

mars.define('config', () => new MarsConfig);
