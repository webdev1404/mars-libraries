'use strict'

class MarsAlerts extends MarsUiContainer {

    /**
     * {@inheritdoc}
     */
    id = 'mars-alerts';

    /**
     * {@inheritdoc}
     */
    dataset = 'alerts';

    /**
     * {@inheritdoc}
     */
    class = 'alerts-container';

    /**
     * The class used to find the alerts container for an element
     * @type {string}
     */
    classes = {
        alerts: 'alerts-box'
    };

    /**
     * Finds the alerts element for a given element
     * @param {object} element The element for which to get the alerts object
     * @return {object|null} The alerts object, or null if it doesn't exist
     */
    find (element) {
        if (!element) {
            return null;
        }
        
        const alertsId = element.dataset[this.dataset] ?? null;
        if (alertsId) {
            return mars.get(alertsId, true);
        }

        return element.parentElement.querySelector(`.${this.classes.alerts}`) ?? null;
    }

    /**
     * Adds an alert to a container
     * @param {object} container The container to which the alert will be added
     * @param {string} id The id of the alert element to add
     * @param {string} html The HTML code for the alert
     * @return {object} The added alert element
     */
    add (id, html, container) {
        return mars.appendHtml(html, id, container, 'afterbegin');
    }

    /**
     * Returns the alerts container element
     * @protected
     * @param {object} [container] The container element. If not specified, the default container is used
     * @return {object} The alerts container element
     */
    get (container) {
        if (container) {
            return mars.get(container, true);
        }

        if (!this.container) {
            this.init();
        }

        return this.container;
    }

    /**
     * Shows the alerts container
     * @protected
     * @param {object} container The container to show
     */
    show (container) {
        container.hidden = false;
    }

    /**
     * Hides the alerts container
     * @protected
     * @param {object} container The container to hide
     */
    hide (container) {
        if (!container.children.length) {
            container.hidden = true;
        }
    }
}

class MarsAlert extends MarsUi {

    /**
     * The default timeout
     * @type {number}
     */
    timeout = 15;

    /**
     * The id prefix used for the alert element
     * @type {string}
     */
    id = 'mars-alert';

    /**
     * The classes used for the alerts
     * @type {object}
     */
    classes = {
        close: 'alert-close',
        text: 'alert-text',
    };

    /**
     * Builds the popup 
     */
    constructor() {
        super();

        this.container = mars.alerts;
    }

    /**
     * @param {string|array|object} text The text of the alert
     * @param {string|object} [container] The element inside which the alert will be shown. If not provided, the alert will be shown in the default container
     * @param {number} [timeout] The interval, in seconds, after which the alert is automatically hidden
     * @return {this}
     */
    add (text, container = null, timeout = null) {
        const textArr = mars.array.get(text);
        container = mars.alerts.get(container);
        timeout = timeout ?? this.timeout;

        for (let text of textArr) {
            const id = mars.random.getId(this.id);
            const html = this.getHtml(id, text);

            const alert = this.container.add(id, html, container);
            
            this.show(container, alert);

            // hide the alert after timeout seconds
            if (timeout) {
                setTimeout(() => this.close(id), timeout * 1000);
            }
        }

        return this;
    }

    /**
     * Returns the html code for the alert
     * @protected
     * @param {string} id The id of the alert
     * @param {string} text The text of the alert
     * @return {string} The HTML code for the alert
     */
    getHtml(id, text) {
        const className = this.getClass();

        return `
            <div id="${id}" class="${className}">
                <a href="javascript:void(0)" onclick="mars.alert.close('${id}')" class="${this.classes.close}"></a>
                <div class="${this.classes.text}">${text}</div>
            </div>`;
    }

    /**
     * Closes an alert
     * @param {string} alert The alert to close
     * @return {this}
     */
    close (alert) {
        alert = mars.get(alert);
        if (!alert) {
            return this;
        }
        
        const container = alert.parentElement;

        this.hide(container, alert);
        
        return this;
    }

    /**
     * Shows an alert
     * @protected
     */
    show (container, alert) {
        this.container.show(container);
        
        alert.hidden = false;
    }

    /**
     * Hides an alert
     * @protected
     * @param {*} container The container of the alert
     * @param {*} alert The alert to hide
     */
    hide (container, alert) {
        alert.hidden = true;
        alert.remove();

        this.container.hide(container);
    }
}

class MarsAlertMessages extends MarsAlert {
    class = 'alert-box alert-box-message';
}

class MarsAlertErrors extends MarsAlert {
    class = 'alert-box alert-box alert-box-error';
}

class MarsAlertWarnings extends MarsAlert {
    class = 'alert-box alert-box-warning';
}

class MarsAlertNotifications extends MarsAlert {
    class = 'alert-box alert-box-notification';
}

mars.define('alerts', () => new MarsAlerts);
mars.define('alert', () => new MarsAlert);
mars.define('messages', () => new MarsAlertMessages);
mars.define('errors', () => new MarsAlertErrors);
mars.define('warnings', () => new MarsAlertWarnings);
mars.define('notifications', () => new MarsAlertNotifications);