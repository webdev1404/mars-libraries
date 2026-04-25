'use strict'

class MarsInputAlert extends MarsUi {

    /**
     * The default timeout
     * @type {number}
     */
    timeout = 15;

    /**
     * The id prefix used for the alert element
     * @type {string}
     */
    id = 'mars-input-alert';

    /**
    * Adds an input alert next to the given input element
    * @param {string|object} input The input element for which the message is shown
    * @param {string} text The text of the alert
    * @param {boolean} [hideOnFocus] Whether to hide the alert when the input element receives focus
    * @param {number} [timeout] The interval, in seconds, after which the alert is automatically hidden
    * @return {this}
    */
    add (input, text, hideOnFocus = true, timeout = null) {
        input = mars.get(input, true);
        const id = mars.random.getId(this.id);
        const html = this.getHtml(id, text);

        const alert = mars.appendHtml(html, id);
        const pos = mars.position.get(input, alert);
        mars.css(alert, {left: pos.x + 'px', top: pos.y + 'px'});

        this.show(alert);

        if (hideOnFocus) {
            input.addEventListener('focus', () => this.hide(id), {once: true});
        }

        // hide the alert after timeout seconds
        timeout = timeout ?? this.timeout;
        if (timeout) {
            setTimeout(() => this.hide(id), timeout * 1000);
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
                ${text}
            </div>`;
    }

    /**
     * Shows the input alert
     * @param {object} alert The alert to show
     * @protected
     */
    show (alert) {
        alert.hidden = false;
    }

    /**
     * Hides an alert
     * @protected
     * @param {string|object} alert The alert to hide
     */
    hide (alert) {
        alert = mars.get(alert);
        if (!alert) {
            return;
        }

        alert.remove();
    }
}

class MarsInputMessages extends MarsInputAlert {
    class = 'alert-input alert-input-message';
}

class MarsInputErrors extends MarsInputAlert {
    class = 'alert-input alert-input-error';
}

class MarsInputWarnings extends MarsInputAlert {
    class = 'alert-input alert-input-warning';
}

class MarsInputInfo extends MarsInputAlert {
    class = 'alert-input alert-input-info';
}

mars.define('inputMessages', () => new MarsInputMessages);
mars.define('inputErrors', () => new MarsInputErrors);
mars.define('inputWarnings', () => new MarsInputWarnings);
mars.define('inputInfo', () => new MarsInputInfo);