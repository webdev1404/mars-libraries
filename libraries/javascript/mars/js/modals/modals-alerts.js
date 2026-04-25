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

class MarsModalConfirmContainer extends MarsUiContainer {

    /**
     * {@inheritdoc}
     */
    dataset = 'confirm';

    /**
     * {@inheritdoc}
     */
    get item () {
        return mars.confirm;
    }

    /**
     * {@inheritdoc}
     */
    enableElement (parent) {
        this.item.autoOpen(parent.dataset[this.dataset], parent);
    }
}

class MarsModalConfirm extends MarsModalAlert {

    /**
     * {@inheritdoc}
     */
    buttons = [
        {
            'value': mars.lang.yes,
            'click': (event) => mars.confirm.opener.click()
        },
        {
            'value': mars.lang.no,
            'click': (event) => mars.modal.close()
        }
    ];

    /**
     * The element that triggered the confirm modal
     * @type {object|null}
     */
    opener = null;

    class = 'modal modal-alert modal-confirm';

    title = mars.lang.confirm;

    /**
     * {@inheritdoc}
     */
    async autoOpen (id, parent, options = {}) {
        this.opener = parent;

        return super.autoOpen(id, parent, options);
    }
}

mars.enable(element => new MarsModalConfirmContainer().enable(element));
mars.define('confirm', () => new MarsModalConfirm);