'use strict'

class MarsArray {
    
    /**
     * Returns an array of elements from a string, array or object
     * @param {string|array|object} element The element(s) to convert to an array
     * @returns {array} The array of elements
     */
    get (element) {
        if (typeof element === 'string') {
            return [element];
        } else if (Array.isArray(element)) {
            return element;
        } else {
            return Object.values(element);
        }
    }
}

mars.define('array', () => new MarsArray);
