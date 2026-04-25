'use strict'

class MarsJson {

    /**
    * Encodes an object using json
    * @param {*} data The data to encode
    * @return {string} The encoded content
    */
    encode (data) {
        return JSON.stringify(data);
    }

    /**
    * Decodes json data
    * @param {string} data The data to decode
    * @return {*} The decoded json data
    */
    decode (data) {
        if (typeof data == 'string') {
            return JSON.parse(data);
        } else {
            return data;
        }
    }
}

mars.define('json', () => new MarsJson);