'use strict'

class MarsPosition {
    
    /**
    * Returns the relative position of a *hidden* absolute positioned element relative to a parent. If element is not given, will only return the position of parent
    * @param {string|object} parent The relative parent element
    * @param {string|object} element The element to get the position for
    * @return {object} The object's position {x, y}
    */
    get (parent, element) {
        parent = mars.get(parent, true);
        let x = parent.offsetLeft;
        let y = parent.offsetTop + parent.offsetHeight;

        if (!element) {
            return {x: x, y: y};
        }

        // move element to a remote position, show it, then get the width and height
        element = mars.get(element, true);
        mars.css(element, {left: '-9999px', top: '-9999px'});
        element.hidden = false;

        const width = element.offsetWidth;
        const height = element.offsetHeight;
        element.hidden = true;

        if (x + width > document.documentElement.scrollWidth) {
            x = parent.offsetLeft - width + parent.offsetWidth;
        }

        if (y + height > document.documentElement.scrollHeight) {
            y = parent.offsetTop - height;
        }

        return {x: x, y: y};
    }
}

mars.define('position', () => new MarsPosition);