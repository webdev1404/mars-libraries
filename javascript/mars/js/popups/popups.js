'use strict'

/**
* The Popups Class
* Shows popups when the user clicks on elements with the data-popup attribute
*/
class MarsPopups extends MarsUiContainer {

    /**
     * {@inheritdoc}
     */
    id = 'mars-popups';

    /**
     * {@inheritdoc}
     */
    dataset = 'popup';
    
    /**
     * The set of opened popups that are fixed
     * @protected
     * @type {Set}
     */
    openedFixed = new Set;

    /**
     * {@inheritdoc}
     */
    get item () {
        return mars.popup;
    }

    /**
     * {inheritdoc}
     */
    enableElement (element) {
        this.item.toggle(element.dataset[this.dataset], element);
    }

    /**
     * Closes all non-fixed opened popups when the user clicks outside
     */
    closeOnClick() {
        document.addEventListener('click', (event) => {
            event.stopPropagation();
            
            if (!this.opened.size) {
                return;
            }

            this.opened.forEach((popup) => {
                if (!popup.hidden && !popup.contains(event.target)) {
                    if (!this.openedFixed.has(popup)) {
                        this.item.close(popup);
                    }
                }
            });
        });
    }
}

/**
* The Popup Class
* Shows a popup when the parent element is clicked
*/
class MarsPopup extends MarsUiItem {

    /**
     * {@inheritdoc}
     */
    class = 'popup';

    /**
     * {@inheritdoc}
     */
    get container () {
        return mars.popups;
    }

    /**
     * Builds the popup 
     */
    constructor() {
        super();

        this.datasets.fixed = 'fixed';
    }

    /**
    * Toggles the popup
    * @param {string} id The id of the item to toggle in the popup
    * @param {string|object} parent The parent opening the popup
    * @return {this}
    */
    async toggle (id, parent) {
        parent = mars.get(parent, true);
        id = this.getIdValue(id, parent);

        const item = this.container.get(id);

        if (item && this.container.opened.has(item)) {
            return this.close(item);
        } else {
            this.open(id, parent);
        }

        return this;
    }

    /**
    * Shows the popup
    * @param {string|object} item The item to show in the popup
    * @param {string|object} parent The parent opening the popup
    * @return {this}
    */
    show (item, parent) {
        let pos = mars.position.get(parent, item);
        mars.css(item, {left: pos.x + 'px', top: pos.y + 'px'});

        const isFixed = this.getDataset(parent, 'fixed');
        if (isFixed) {
            this.container.openedFixed.add(item);
        }

        super.show(item);

        return this;
    }

    /**
     * Closes the popup
     * @param {string|object} item The item to close
     * @return {this}
     */
    close (item) {
        if (this.container.openedFixed.has(item)) {
            this.container.openedFixed.delete(item);
        }

        super.close(item);

        return this;
    }
}

mars.define('popups', () => new MarsPopups).enable(popup => mars.popups.enable(popup)).ready(() => mars.popups.closeOnClick());
mars.define('popup', () => new MarsPopup);