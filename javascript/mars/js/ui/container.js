'use strict'

class MarsUiContainer {

    /**
     * The elements list
     * @protected
     * @type {Map}
     */
    list = new Map;

    /**
     * The set of opened elements
     * @protected
     * @type {Set}
     */
    opened = new Set;

    /**
     * The container's id
     * @protected
     * @type {string}
     */
    id = '';

    /** 
     * The class applied to the container, if any
     * @protected
     * @type {string}
     */
    class = '';

    /**
     * The dataset used to select the elements
     * @protected
     * @type {string}
     */
    dataset = '';

    /**
     * The container object
     * @protected
     * @type {object|null}
     */
    container = null;

    /**
     * The item object. Should be implemented in the child classes.
     */
    get item () {
        return null;
    }

    /**
     * Enables the elements
     * @protected
     * @param {string|object} obj The object over which the elements will be enabled
     */
    enable (obj) {
        const selector = `[data-${this.dataset}]`;

        obj.querySelectorAll(selector).forEach((parent) => {
            parent.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                this.enableElement(parent);
            });
        });
    }

    /**
     * Enables the element. Should be implemented in the child classes.
     * @param {object} parent The parent opening the element
     */
    enableElement (parent) {
        this.item.open(parent.dataset[this.dataset], parent);
    }

    /**
     * Initializes the container
     */
    init () {
        this.container = mars.append(this.id);
        this.container.hidden = true;
        if (this.class) {
            this.container.className = this.class;
        }
    }

    /**
     * Returns the content stored into the container
     * @param {string} id The content id
     * @return {object|null} The content, or null if it doesn't exist
     */
    get (id) {
        if (!this.list.has(id)) {
            return null;
        }

        const content = mars.get(this.list.get(id));
        if (content) {
            return content;
        }

        this.list.delete(id);

        return null;
    }

    /**
     * Creates the item and adds it to the container
     * @param {string} id The item's id
     * @param {string} html The item's HTML code
     * @param {string} className The class name to apply to the item
     * @return {object} The created item
     */
    add (id, html, className) {
        if (!this.container) {
            this.init();
        }

        const itemId = mars.random.getId(this.id);
        const item = mars.append(itemId, this.container);
        item.className = className;
        item.innerHTML = html;

        this.list.set(id, itemId);

        return item;
    }

    /**
     * Marks the item as opened
     * @param {string|object} item The item to open
     */
    open (item) {
        this.opened.add(item);
    }

    /**
     * Marks the item as closed
     * @param {string|object} item The item to close
     */
    close (item) {
        this.opened.delete(item);
    }

    /**
     * Shows the container
     */
    show() {
        this.container.hidden = false;
    }

    /**
     * Hides the container
     */
    hide() {
        if (this.opened.size > 0) {
            return;
        }

        this.container.hidden = true;
    }
}
