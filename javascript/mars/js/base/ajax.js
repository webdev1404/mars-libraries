'use strict'

class MarsAjax {

    /**
     * Sends an ajax request
     * @param {string} url The url
     * @param {object} [options] Additional options for the fetch request
     * @return {object} The response json data
     * @throws {MarsAjaxError} If the request fails or the response is not ok
     */
    async fetch (url, options = {}) {
        options.headers = options.headers || {};
        options.headers['Accept'] = options.headers['Accept'] || 'application/json';

        try {
            const response = await fetch(url, options);

            if (response.ok) {
                return await response.json();
            } else {
                throw new MarsAjaxError(mars.lang.get('ajax_error', {error: response.status}));
            }
        } catch (error) {
            throw new MarsAjaxError(error.message);
        }
    }
    
    /**
     * Returns the response data as text
     * @param {string} url The url
     * @param {object} [alertsContainer] The container for the alert messages. If not specified, messages will be added to the default system container
     * @param {object} [options] Additional options for the fetch request
     * @return {object} The response data
     * @throws {MarsAjaxError} If the request fails or the response is not ok
     */
    async get(url, alertsContainer = null, options = {}) {
        return await this.data(url, alertsContainer, options);
    }

    /**
     * Sends an ajax POST request
     * @param {string} url The url
     * @param {object} [alertsContainer] The container for the alert messages. If not specified, messages will be added to the default system container
     * @param {object} data The data to send
     * @param {object} [options] Additional options for the fetch request
     * @return {object} The response data
     * @throws {MarsAjaxError} If the request fails or the response is not ok
     */
    async post (url, data, alertsContainer = null, options = {}) {
        return await this.data(url, alertsContainer, this.getPostOptions(data, options));
    }

    /**
     * Returns the options for a POST request
     * @param {object|FormData} data The data
     * @param {object} options Additional options for the fetch request
     * @return {object} The POST options
     */
    getPostOptions (data, options) {
        options = {...options, method: 'POST'};
        options.headers = options.headers || {};

        if (data instanceof FormData) {
            options.body = data;

            return options;
        }

        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.body = this.getPostData(data);
        
        return options;
    }

    /**
     * Builds the POST data string from the given data object
     * @param {object} data The data object
     * @return {string} The POST data string
     */
    getPostData (data) {
        let elements = [];
        for (let [key, value] of Object.entries(data)) {
            let param = encodeURIComponent(key) + '=' + encodeURIComponent(value);
            elements.push(param);
        }

        return elements.join('&');
    }

    /**
     * Returns the response data
     * @param {string} url The url
     * @param {object} [alertsContainer] The container for the alert messages. If not specified, messages will be added to the default system container
     * @param {object} [options] Additional options for the fetch request
     * @return {object} The response object
     * @throws {MarsAjaxError} If the request fails or the response is not ok
     */
    async data(url, alertsContainer = null, options = {}) {
        const data = await this.fetch(url, options);

        if ('success' in data && !data.success) {
            const handleErrors = options.errors ?? true;
            const errors = data.errors;

            if (handleErrors && errors) {
                mars.errors.add(this.getAlerts(errors), alertsContainer);
            }

            throw new MarsAjaxError('Ajax request failed', errors);
        }

        const messages = data.messages ?? null;
        const warnings = data.warnings ?? null;
        const info = data.info ?? null;

        if (messages) {
            mars.messages.add(this.getAlerts(messages), alertsContainer);
        }

        if (warnings) {
            mars.warnings.add(this.getAlerts(warnings), alertsContainer);
        }

        if (info) {
            mars.info.add(this.getAlerts(info), alertsContainer);
        }

        return data.data ?? null;
    }

    /**
     * Returns an array of alert messages from the given alerts object
     * @protected
     * @param {object} alerts The alerts object
     * @return {array} An array of alert messages
     */
    getAlerts (alerts) {
        const alertsArray = [];
        for (let alert of alerts) {
            alertsArray.push(alert.text);
        }

        return alertsArray;
    }
}

class MarsAjaxError extends Error {

    /**
     * The error messages
     * @type {array|object}
     */
    errors = null;

    /**
     * Builds the MarsAjaxError object
     * @param {string} error The error message
     * @param {array|object} errors The error messages
     */
    constructor(error, errors = null) {
        super(error);
        
        this.errors = errors;
        if (this.errors === null) {
            this.errors = [error];
        }
    }
}

mars.define('ajax', () => new MarsAjax());