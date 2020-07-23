'use strict';
const template = require('path').join(__dirname, 'template.xml');
module.exports = (...params) => class soapSimulator extends require('ut-port-httpserver')(...params) {
    async start(...params) {
        const startResult = await super.start(...params);
        this.registerRequestHandler([{
            method: 'POST',
            path: '/soap/test',
            options: {
                auth: false,
                handler: (response, h) => h.file(template)
            }
        }]);
        return startResult;
    }
};
