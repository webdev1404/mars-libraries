'use strict'

class MarsRandom {
    
    /**
     * The id index, used to generate unique ids
     * @protected
     * @type {int}
     */
    id_index = 0;

    /**
    * Returns a random string
    * @param {int} [length=32] The length of the string to generate
    * @return {string} The random string
    */
    getString (length = 32) {
        const arr = new Uint8Array(length);
        crypto.getRandomValues(arr);

        return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('').slice(0, length);
    }

    /**
    * Returns a random number
    * @param {int} min The min interval
    * @param {int} max The max interval
    * @return {int} The random number
    */
    getInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
    * Returns a random string, used for IDs
    * @return {string} The random string
    */
    getIdString () {
        return Math.random().toString(36).substring(2, 10);
    }

    /**
    * Returns a unique id
    * @param {string} [prefix] A prefix to use, if any
    * @return {string} The unique id
    */
    getId (prefix = '') {
        return (prefix ? prefix + '-' : '') + this.getIdString() + '-' + this.id_index++;
    }
}

mars.define('random', () => new MarsRandom);