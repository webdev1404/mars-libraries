'use strict'

class MarsHtmlForms {

    /**
     * The selectors for the elements that will have enable actions
     * @type {string}
     */
    selectors = {submit: '[data-submit]'};

    /**
     * The datasets used for the html elements
     * @type {object}
     */
    datasets = {
        submit: 'submit',
        alerts: 'alerts',
        loading: 'loading'
    };

    /**
     * Enables the HTML actions
     * @protected
     * @param {string|object} element The element over which the HTML actions will be enabled
     */
    enable (element) {
        element.querySelectorAll(this.selectors.submit).forEach((element) => {
            this.enableSubmit(element);
        });
    }

    /**
     * Enables the submit action for the given element
     * @protected
     * @param {object} element The element for which the submit action will be enabled
     */
    async enableSubmit (element) {
        this.handleSubmit(element);
    }

    /**
     * Handles the submit action for the given element
     * @protected
     * @param {object} element The element for which the submit action was performed
     * @param {function|null} onSuccess The function to be called when the submit action is successful, or null to use the default function
     * @param {function|null} onError The function to be called when the submit action returns errors, or null to use the default function
     */
    async handleSubmit(element, onSuccess = null, onError = null) {
        if (onSuccess === null) {
            onSuccess = (data, form) => this.handleSubmitData(data, form);
        }
        
        if (onError === null) {
            onError = (errors, form, alerts) => this.handleSubmitErrors(errors, form, alerts);
        }

        element.addEventListener('click', async (event) => {
            const form = element.form;
            if (!form.checkValidity()) {
                return;
            }

            event.preventDefault();

            element.disabled = true;
            
            let url = element.dataset[this.datasets.submit];
            if (url.trim().toLowerCase() === 'true') {
                url = form.action;
            }

            const alerts = mars.alerts.find(element);

            mars.loading.showForSubmit(element);

            try {
                const data = await mars.ajax.post(url, new FormData(form), alerts, {errors: false});

                onSuccess(data, form);
            } catch (error) {
                const errors = error.errors;

                onError(errors, form, alerts);
            } finally {
                mars.loading.hideForSubmit(element);

                element.disabled = false;

                const event = new CustomEvent('marsFormSubmitFinished', {detail: {form}});
                form.dispatchEvent(event);
            }
        });
    }

    /**
     * Handles the data returned from a submit action
     * @protected
     * @param {object} data The data returned from the submit action
     * @param {object} form The form element for which the submit action was performed
     */
    handleSubmitData (data, form) {
        form.reset();

        const content = data?.content ?? null;
        if (content) {
            mars.modals.text.open(content);
        }

        const event = new CustomEvent('marsFormSubmitSuccess', {detail: {form, data}});
        form.dispatchEvent(event);
    }

    /**
     * Handles the errors returned from a submit action
     * @protected
     * @param {object} errors The errors returned from the submit action
     * @param {object} form The form element for which the submit action was performed
     * @param {object|null} alerts The alerts element where the general errors will be shown
     */
    handleSubmitErrors (errors, form, alerts = null) {
        for (let key in errors) {
            const error = errors[key];

            if (error.field) {
                const input = form[error.field] ?? null;
                if (input) {
                    mars.inputErrors.add(input, error.text);
                    continue;
                }
            }

            mars.errors.add(error.text, alerts);
        }

        const event = new CustomEvent('marsFormSubmitErrors', {detail: {form, errors}});
        form.dispatchEvent(event);
    }
}

mars.define('htmlForms', () => new MarsHtmlForms).enable(element => mars.htmlForms.enable(element));