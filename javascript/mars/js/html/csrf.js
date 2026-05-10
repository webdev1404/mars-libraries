'use strict'

class MarsCsrf {

    /**
     * The token used for the CSRF protection
     * @protected
     * @type {string|null}
     */
    token = null;
    
    /**
     * Enables the csrf protection for the forms in the given element
     * @protected
     * @param {string|object} element The element over which the HTML actions will be enabled
     */
    async enable (element) {
        const url = mars.config.get('csrf.url');
        const name = mars.config.get('csrf.name');
        if (!url || !name) {
            return;
        }

        let forms = null;

        if (element === document) {
            forms = element.forms;
        } else {
            forms = element.getElementsByTagName('form');
        }

        if (forms.length == 0) {
            return;
        }

        if (!this.token) {
            const data = await mars.ajax.post(url, {});
            const token = data.csrf ?? null;

            if (!token) {
                mars.errors.add('CSRF token not found in response');
                return;
            }

            this.token = token;

            for (let i = 0; i < forms.length; i++) {
                const form = forms[i];
                const input = form[name];
                input.value = this.token;
            }
        }
    }
}

mars.define('htmlCsrf', () => new MarsCsrf).enable(element => mars.htmlCsrf.enable(element));