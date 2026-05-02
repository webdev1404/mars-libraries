'use strict'

class MarsUiItem extends MarsUi {

    /**
     * The container object. Should be implemented in the child classes.
     * @protected
     * @type {object|null}
     */
    get container () {
        return null;
    }

    /**
     * Returns the id value for the item
     * @param {string} id The id value to get
     * @param {object} parent The parent opening the item
     * @return {string} The id value for the item
     */
    getIdValue (id, parent) {
        if (id == '#' && parent) {
            return parent.getAttribute('href');
        }

        return id;
    }

    /**
     * Opens the content
     * @param {string} id The id of the content to open
     * @param {object} parent The parent opening the content
     * @param {object} options The options for opening the content
     * @return {this}
     */
    async open (id, parent, options = {}) {
        parent = mars.get(parent);
        id = this.getIdValue(id, parent);

        let item = this.container.get(id);

        if (item === null) {
            let content = null;

            if (mars.url.is(id)) {
                content = await this.getFromUrl(id, parent);
            } else {
                const obj = mars.get(id);

                content = obj ? obj.innerHTML : id;
            }

            if (!content) {
                return this;
            }

            item = this.container.add(id, this.getHtml(content, parent, options), this.getClass(parent, options.class ? [options.class] : []));

            this.set(item, parent, options);
        }

        this.container.open(item);

        this.show(item, parent);

        return this;
    }

    /**
     * Gets the content from the URL
     * @param {string} url The URL from which to get the content
     * @param {object|null} parent The parent opening the content, if any
     * @return {string|null} The content, or null if it couldn't be retrieved
     */
    async getFromUrl (url, parent) {
        const loading = mars.loading.find(parent);

        this.showLoading(loading);

        try {
            const data = await mars.ajax.get(url);
            const content = data?.content ?? null;

            if (content === null) {
                mars.messages.add(mars.lang.get('ajax_content_error'));

                return null;
            }

            return content;
        } catch (error) {
            mars.messages.add(error.message);
        } finally {
            this.hideLoading(loading);
        }

        return null;
    }

    /**
     * Shows the loading item
     * @param {object} loading The loading item to show
     */
    showLoading (loading) {
        if (loading) {
            mars.loading.showSmall(loading);
        }
    }

    /**
     * Hides the loading item
      * @param {object} loading The loading item to hide
     */
    hideLoading (loading) {
        if (loading) {
            mars.loading.hideSmall(loading);
        }
    }

    /**
     * Sets the item's data. Should be implemented in the child classes.
     */
    set (item, parent, options) {
        const width = options.width || this.getWidth(parent);
        const height = options.height || this.getHeight(parent);

        mars.css(item, {width: width, height: height});
    }

    /**
     * Shows the content
     * @param {object} item The item to show
     * @return {this}
     */
    show (item, parent) {
        this.container.show();

        item.hidden = false;

        return this;
    }

    /**
     * Closes the item
     * @param {string|object} item The item to close
     * @return {this}
     */
    close (item) {
        item = mars.get(item, true);

        item.hidden = true;

        this.container.close(item);
        this.container.hide();

        return this;
    }

    /**
     * Returns the HTML code 
     * @param {string} content The content to be included in the HTML
     * @param {object} parent The parent opening the item
     * @param {object} options The options for opening the item
     * @return {string} The HTML code
     */
    getHtml (content, parent, options) {
        return content;
    }
}

