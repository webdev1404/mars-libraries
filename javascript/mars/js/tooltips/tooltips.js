'use strict'

/**
* The Tooltips Class
* Shows tooltips when the user hovers over elements with the data-tooltip attribute
*/
class MarsTooltips {

    /**
     * The tooltip object
     * @protected
     * @type {MarsTooltip}
     */
    tooltip = new MarsTooltip;

    /**
     * Enables the tooltips
     * @protected
     * @param {string|object} element The element over which the tooltips will be enabled
     */
    enable (element) {
        const selector = `[data-${this.tooltip.dataset}]`;

        element.querySelectorAll(selector).forEach((element) => {
            element.addEventListener('mouseenter', (event) => {
                this.tooltip.show(element);
            });

            element.addEventListener('mouseleave', (event) => {
                this.tooltip.hide();
            });
        });
    }
}

class MarsTooltip extends MarsUi {

    /**
     * The id used for the tooltip element
     * @type {string}
     */
    id = 'mars-tooltip';
    
    /**
     * The class applied to the tooltip element
     * @type {string}
     */
    class = 'tooltip';

    /**
     * The datasets used for the tooltip
     * @type {string}
     */
    dataset = 'tooltip';

    /**
     * The tooltip object
     * @type {object|null}
     * @private
     */
    tooltip = null;

    /**
    * Creates the tooltip element
    * @protected
    */
    init () {
        this.tooltip = mars.append(this.id);
        this.tooltip.hidden = true;
    }

    /**
    * Displays a tooltip
    * @param {string|object} element The element to which the tooltip is attached
    */
    show (element) {
        if (!this.tooltip) {
            this.init();
        }

        element = mars.get(element, true);

        this.tooltip.innerHTML = element.dataset[this.dataset];
        this.tooltip.className = this.getClass(element);

        const pos = mars.position.get(element, this.tooltip);
        mars.css(this.tooltip, {left: pos.x + 'px', top: pos.y + 'px'});

        this.tooltip.hidden = false;
    }

    /**
     * Hides the tooltip
     */
    hide () {
        this.tooltip.hidden = true;
    }
}

mars.define('tooltips', () => new MarsTooltips).enable(element => mars.tooltips.enable(element));