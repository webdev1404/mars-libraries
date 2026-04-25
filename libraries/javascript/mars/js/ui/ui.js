'use strict'

class MarsUi {

    /**
     * The class applied to the element, if any
     * @type {string}
     */
    class = '';

    /**
     * The datasets used for the element, if any
     * @type {object}
     */
    datasets = {
        class: 'class',
        title: 'title',
        width: 'width',
        height: 'height'
    }

    /**
     * Returns the dataset value for the element and dataset name, if any
     * @param {object} element The element for which to get the dataset value
     * @param {string} name The name of the dataset to get
     * @returns {string|null} The dataset value for the element and dataset name, or null if not set
     */
    getDataset(element, name) {
        if (!element) {
            return null;
        }

        if (element.dataset[this.datasets[name]]) {
            return element.dataset[this.datasets[name]];
        }

        return null;
    }

    /**
     * Returns the class name for the element, if any
     * @param {object} [element] The element for which to get the class name
     * @param {array} [classes] An array of classes to which the class for the element will be added
     * @returns {string}
     */
    getClass(element = null, classes = []) {
        if (this.class) {
            classes.push(this.class);
        }
        if (element && element.dataset[this.datasets.class]) {
            classes.push(element.dataset[this.datasets.class]);
        }

        return classes.join(' ');
    }

    /**
     * Returns the width for the element, if any
     * @param {object} element The element for which to get the width
     * @returns {string|null} The width of the element, or null if not set
     */
    getWidth(element) {
        const width = this.getDataset(element, 'width');

        return this.getDimension(width);
    }

    /**
     * Returns the height for the element, if any
     * @param {object} element The element for which to get the height
     * @returns {string|null} The height of the element, or null if not set
     */
    getHeight(element) {
        const height = this.getDataset(element, 'height');

        return this.getDimension(height);
    }

    /**
     * Returns the dimension for the value, if any
     * @param {string|number} value The value for which to get the dimension
     * @returns {string|null} The dimension for the value, or null if not set
     */
    getDimension(value) {
        if (!value) {
            return null;
        }

        if (!Number.isNaN(value)) {
            return value + 'px';
        }

        return value;
    }

    /**
     * Returns the title for the element, if any
     * @param {object} element The element for which to get the title
     * @returns {string} The title of the element
     */
    getTitle(element) {
        return this.getDataset(element, 'title') || '';
    }

}