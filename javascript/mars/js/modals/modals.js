'use strict'

/**
* The Modals Class
*/
class MarsModals extends MarsUiContainer {

    /**
     * The message modal object
     * @type {MarsModalMessage}
     */
    message = new MarsModalMessage;

    /**
     * The error modal object
     * @type {MarsModalError}
     */
    error = new MarsModalError;

    /**
     * The warning modal object
     * @type {MarsModalWarning}
     */
    warning = new MarsModalWarning;

    /**
     * The notification modal object
     * @type {MarsModalNotification}
     */
    notification = new MarsModalNotification;
    /**
     * The registry of objects
     * @type {MarsRegistry}
     */
    /*registry = new MarsRegistry({
        confirm: () => new MarsModalConfirm,
    });*/


    /**
     * The ids used for the modal elements
     * @type {object}
     */
    ids = {
        overlay: 'mars-modals-overlay',
        modals: 'mars-modals'
    };

    /**
     * The classes used for the modal elements
     * @type {object}
     */
    classes = {
        overlay: 'modals-overlay',
        modals: 'modals'
    };

    /**
     * The dataset used for the modal elements
     * @type {string}
     */
    dataset = 'modal';

    /**
     * The overlay object
     * @protected
     * @type {object|null}
     */
    overlay = null;

    /**
     * {@inheritdoc}
     */
    get item () {
        return mars.modal;
    }

    /**
     * Returns the modal object
     * @return {MarsModal} The modal object
     */
    get modal() {
        return mars.modal;
    }

    /**
     * {@inheritdoc}
     */
    enableElement (parent) {
        this.item.autoOpen(parent.dataset[this.dataset], parent);
    }

    /**
     * {@inheritdoc}
     */
    init() {
        mars.appendHtml(this.getHtml());

        this.container = mars.get(this.ids.modals);
        this.overlay = mars.get(this.ids.overlay);
        this.overlay.hidden = true;

        //close the modal if the overlay is clicked
        this.overlay.addEventListener('click', (event) => {
            event.stopPropagation();

            if (!this.opened.size) {
                return;
            }

            this.opened.forEach((modal) => {
                if (!modal.hidden && !modal.contains(event.target)) {
                    this.item.close();
                }
            });
        });
    }

    /**
     * Returns the HTML code for the modals container and overlay
     * @return {string} The HTML code
     */
    getHtml () {
        return `
            <div id="${this.ids.overlay}" class="${this.classes.overlay}">
                <div id="${this.ids.modals}" class="${this.classes.modals}">
                </div>
            </div>`;
    }

    /**
     * {@inheritdoc}
     */
    show() {
        this.overlay.hidden = false;
        this.container.hidden = false;
    }

    /**
     * {@inheritdoc}
     */
    hide() {
        if (this.opened.size > 0) {
            return;
        }

        this.container.hidden = true;
        this.overlay.hidden = true;
    }
}

class MarsModal extends MarsUiItem {

    /**
     * {@inheritdoc}
     */
    class = 'modal';

    /**
     * The classes used for the modal elements
     * @type {object}
     */
    classes = {
        title: 'modal-title',
        content: 'modal-content',
        buttons: 'modal-buttons',
        close: 'modal-close'
    };

    /**
     * The default title of the modal
     */
    title = '';

    /**
     * The buttons that will be added to the modal, if any
     * @type {array}
     */
    buttons = [];

    /**
     * {@inheritdoc}
     */
    get container () {
        return mars.modals;
    }

    async open (id, options = {}) {
        return super.open(id, null, options);
    }

    async autoOpen (id, parent, options = {}) {
        return super.open(id, parent, options);
    }

    /** 
     * {@inheritdoc}
     */
    getHtml (content, parent, options) {
        const title = options.title || this.getTitle(parent) || this.title || '';

        return `
            <div class="${this.classes.title}">
                <a href="javascript:void(0)" onclick="mars.modal.close()" class="${this.classes.close}"></a>
                <h1>${title}</h1>
            </div>
            <div class="${this.classes.content}">${content}</div>
            <div class="${this.classes.buttons}"></div>`;
    }

    /** 
     * {@inheritdoc}
     */
    showLoading (loading) {
        mars.loading.show();
    }

    /** 
     * {@inheritdoc}
     */
    hideLoading (loading) {
        mars.loading.hide();
    }

    /** 
     * {@inheritdoc}
     */
    set (item, parent, options) {
        super.set(item, parent, options);

        this.setButtons(item);
    }

    /**
     * Sets the modal's buttons
     * @protected
    */
    setButtons (item) {
        if (!this.buttons.length) {
            return; 
        }

        const buttonsElement = item.querySelector(`.${this.classes.buttons}`);

        for (const button of this.buttons) {
            const btn = document.createElement('input');
            btn.type = 'button';
            btn.value = button.value;

            if (button.click) {
                btn.onclick = button.click;
            }

            buttonsElement.append(btn);
        }
    }

    /**
     * {@inheritdoc}
     */
    close () {
        this.container.opened.forEach(item => {
            super.close(item);
        });
    }
}

mars.define('modals', () => new MarsModals).enable(element => mars.modals.enable(element));
mars.define('modal', () => new MarsModal);