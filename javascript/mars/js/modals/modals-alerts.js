'use strict'

class MarsModalAlert extends MarsModal {

    /**
     * The buttons that will be added to the modal
     * @type {array}
     */
    buttons = [{
        'value': mars.lang.ok,
        'click': (event) => mars.modal.close()
    }];
}

class MarsModalMessage extends MarsModalAlert {

    class = 'modal modal-alert modal-message';

    title = mars.lang.message;
}

class MarsModalError extends MarsModalAlert {

    class = 'modal modal-alert modal-error';

    title = mars.lang.error;
}

class MarsModalWarning extends MarsModalAlert {

    class = 'modal modal-alert modal-warning';

    title = mars.lang.warning;
}

class MarsModalNotification extends MarsModalAlert {

    class = 'modal modal-alert modal-notification';

    title = mars.lang.notification;
}

class MarsModalConfirm extends MarsModalAlert {

    selector = '[data-confirm]';

    dataset = 'confirm';

    buttons = [
        {
            'value': mars.lang.yes,
            'click': (event) => mars.modals.confirm.opener.click()
        },
        {
            'value': mars.lang.no,
            'click': (event) => mars.modals.opened.close()
        }
    ];

    id = 'mars-modal-confirm';

    class = 'modal modal-alert modal-confirm';

    title = mars.lang.confirm;

    /**
     * The element which opens the modal
     * @type {object|null}
     */
    opener = null;

    /**
     * Enables the confirm modals
     * @param {string|object} [element] Optional element within which confirm modals will be enabled. If not specified, document is used
     */
    enable (element) {
        element.querySelectorAll(this.selector).forEach((element) => {
            element.addEventListener('click', (event) => {
                //the event was triggered by the Yes button in the modal
                if (!event.isTrusted) {
                    return true;
                }

                event.preventDefault();
                event.stopPropagation();

                this.opener = element;

                const options = mars.modals.getOptions(element);
                options.title = options.title || mars.lang.confirm;

                this.open(element.dataset[this.dataset], options);
            });
        });
    }
}