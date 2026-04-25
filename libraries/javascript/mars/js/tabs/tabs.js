'use strict'

/**
* The Tabs Class
* Manages the behavior of tabbed content
*/
class MarsTabs {

    /**
     * The selector used for the tabs
     * @type {string}
     * @protected
     */
    selector = '.tabs';

    /**
     * The datasets used for the tabs
     * @type {object}
     * @protected
     */
    datasets = {
        current: 'current',
    };

    /**
     * Enables the tabs
     * @protected
     * @param {string|object} element The element over which the tabs will be enabled
     */
    enable (element) {
        element.querySelectorAll(this.selector).forEach((element) => {

            const currentTab = element.dataset[this.datasets.current] || 1;
            const tabs = element.querySelectorAll(':scope > ul li');
            const contentArr = element.querySelectorAll(':scope > div');

            this.set(element, tabs, contentArr, currentTab);

            tabs.forEach((tab, index) => {
                const tabId = index + 1;

                tab.addEventListener('click', (event) => {
                    this.set(element, tabs, contentArr, tabId);
                });
            });
        });
    }

    /**
     * Sets the current tab
     * @param {object} element The element containing the tabs
     * @param {object} tabs The tab elements
     * @param {object} contentArr The tab content elements
     * @param {number} currentTab The id of the current tab
     */
    set (element, tabs, contentArr, currentTab) {
        tabs.forEach((tab, index) => {
            const tabId = index + 1;

            if (tabId == currentTab) {
                tab.classList.add('current');
            } else {
                tab.classList.remove('current');
            }
        });

        contentArr.forEach((content, index) => {
            const contentId = index + 1;

            if (contentId == currentTab) {
                content.classList.add('current');
            } else {
                content.classList.remove('current');
            }
        });
    }
}

mars.define('tabs', () => new MarsTabs).enable(element => mars.tabs.enable(element));