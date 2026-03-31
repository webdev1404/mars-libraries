'use strict'

/**
* The Loading Class
* Shows a loading icon over a specified area
*/
class MarsLoading extends MarsUi {

    /**
     * List with the ids of the loading elements
     * @type {object}
     */
    ids = {
        overlay: 'loading-overlay',
        container: 'loading-container',
        image: 'loading-image'
    };

    class = 'loading-overlay';

    /**
     * The classes used for the loading elements
     * @type {object}
     */
    classes = {
        element_overlay: 'loading-overlay-element',
        container: 'loading-container',
        image: 'loading-image',
        small: 'loading-small'
    };

    /**
     * The dataset used for the loading elements
     * @type {string}
     */
    dataset = 'loading';

    /**
     * The loading overlay object
     * @protected
     * @type {object|null}
     */
    overlay = null;

    /**
     * Creates the loading object
     * @protected
     */
    init () {
        mars.appendHtml(this.getHtml());

        this.overlay = document.getElementById(this.ids.overlay);
        this.overlay.hidden = true;
    }

    /**
     * Returns the html for the loading overlay
     * @protected
     * @return {string} The html for the loading overlay
     */
    getHtml () {
        return `
            <div id="${this.ids.overlay}">
                <div id="${this.ids.container}" class="${this.classes.container}">
                    <div id="${this.ids.image}" class="${this.classes.image}"></div>
                </div>
            </div>`;
    }

    /**
     * Finds the loading element for a given element
     * @param {object} element The element
     * @return {object|null} The loading object, or null if it doesn't exist
     */
    find (element) {
        if (!element) {
            return null;
        }

        const loadingId = element.dataset[this.dataset] ?? null;
        if (loadingId) {
            return mars.get(loadingId, true);
        }

        return element.parentElement.querySelector(`.${this.classes.small}`) ?? null;
    }

    /**
    * Shows the loading screen
    * @param {string|object} [element] If specified will show the animation over element. If not specified, will show it on the entire screen
    * @return {this}
    */
    show (element = null) {
        if (!this.overlay) {
            this.init();
        }

        let classes = [];
        let css = {
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%'
        };

        if (element) {
            element = mars.get(element, true);
            const pos = element.getBoundingClientRect();

            classes = [this.classes.element_overlay];
            css = {
                position: 'absolute',
                left: pos.left + 'px',
                top: pos.top + 'px',
                width: element.offsetWidth + 'px',
                height: element.offsetHeight + 'px'
            }
        } 

        mars.css(this.overlay, css);

        this.overlay.className = this.getClass(element, classes);
        this.overlay.hidden = false;

        return this;
    }

    /**
    * Hides the loading screen
    * @return {this}
    */
    hide () {
        this.overlay.hidden = true;

        return this;
    }

    /**
    * Shows a small loading icon inside an element
    * @param {string|object} element The element to show the loading icon in
    * @return {this}
    */
    showSmall (element) {
        mars.get(element, true).hidden = false;

        return this;
    }

    /**
     *  Hides the small loading icon inside an element
     * @param {string|object} element The element to hide the loading icon from
     * @return {this}
     */
    hideSmall (element) {
        mars.get(element, true).hidden = true;

        return this;
    }
}

mars.define('loading', () => new MarsLoading);