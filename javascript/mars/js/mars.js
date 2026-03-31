'use strict'

class Mars {

    /**
     * The registry of objects
     * @protected
     * @type {Map}
     */
    registry = new Map;

    /**
     * Defines a new object in the registry
     * @param {string} name The name of the object to define
     * @param {function} callback The callback function to create the object
     * @return {this}
     */
    define (name, callback) {
        Object.defineProperty(this, name, {
            get() {
                return this.getObject(name, callback);
            },
            set(value) {
            },
            enumerable: true,
            configurable: true
        });

        return this;
    }

    /**
     * Returns the object from the map or creates it if it does not exist
     * @protected
     * @param {string} name The name of the object to get
     * @param {function} [callback] A callback function to be called to retrieve the object if it is not defined in the map
     * @return {object} The object from the map
     * @throws {Error} If the object is not defined in the map
     */
    getObject (name, callback) {
        if (this.registry.has(name)) {
            return this.registry.get(name);
        }

        const obj = callback();

        this.registry.set(name, obj);

        return obj;
    }

    /**
     * The list of events to be executed when mars is enabled for an element
     * @type {array}
     */
    enableEvents = [];

    /**
     * Calls the callback function when mars is enabled for an element
     * @param {function} callback The callback function to be called
     * @return {this}
     */
    enable (callback) {
        this.enableEvents.push(callback);

        return this;
    }

    /**
     * Triggers the enable events for an element
     * @param {string|object} [element] Optional element over which the modals will be shown. If not specified, document is used
    */
    triggerEnable (element) {
        if (!element) {
            element = document;
        }

        for (let i = 0; i < this.enableEvents.length; i++) {
            this.enableEvents[i](element);
        }
    }

    /**
     * Function to be executed when the document is ready
     * @param {function} func The function to execute
     * @return {this}
    */
    ready (func) {
        if (document.readyState == 'complete') {
            func();
        } else {
            document.addEventListener('DOMContentLoaded', func);
        }

        return this;
    }

    /**
     * Returns a dom object
     * @param {string|object} id The object's id
     * @param {boolean} [mustExist=false] If true, will throw an error if the object does not exist
     * @return {object|null} The object
    */
    get (id, mustExist = false) {
        if (typeof id == 'object') {
            return id;
        }

        const obj = document.getElementById(id);
        if (!obj && mustExist) {
            throw new Error(`Element with id "${id}" does not exist.`);
        }

        return obj;
    }

    /**
     * Detects if an element with a certain id exists in the dom tree
     * @param {string|object} id The id
     * @return {bool} Returns true if the object exists
    */
    exists (id) {
        return Boolean(this.get(id));
    }

    /**
     * Returns the parent of an element
     * @param {string|object} [parent] The parent element. If not specified, document.body is used
     * @return {object} The parent element
     */
    parent (parent = null) {
        return parent ? this.get(parent, true) : document.body;
    }

    /**
     * Appends an element to the body
     * @param {string} id The id of the element to append
     * @param {string|object} [parent] The parent element. If not specified, document.body is used
     * @param {string} [type='div'] The type of the element to append Eg: div
     * @return {object} The appended element
     */
    append (id, parent = null, type = 'div') {
        const element = document.createElement(type);
        element.id = id;

        this.parent(parent).append(element);

        return element;
    }

    /**
     * Appends HTML to an element
     * @param {string} html The HTML to append
     * @param {string} [id] The id of the element to append to. If specified, the appended element will be returned
     * @param {string|object} [parent] The parent element. If not specified, document.body is used
     * @param {string} [type='beforeend'] The position where the HTML will be appended. Eg: beforeend, afterbegin
     */
    appendHtml(html, id = null, parent = null, type = 'beforeend') {
        this.parent(parent).insertAdjacentHTML(type, html);

        if (id) {
            return this.get(id);
        }

        return null;
    }

    /**
     * Sets css properties for an element
     * @param {string|object} id The id of the element
     * @param {object} css The css properties to set
     * @return {this}
     */
    css (id, css) {
        const obj = this.get(id, true);

        for (let key in css) {
            const value = css[key];
            if (!value) {
                continue;
            }

            obj.style[key] = value;
        }

        return this;
    }
}

const mars = new Mars();

mars.ready(() => {
    mars.triggerEnable();
});