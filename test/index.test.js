const path = require('path');

require('ut-run').run({
    main: [
        () => ({
            test: () => [
                require('./mock'),
                require('..')
            ]
        })
    ],
    method: 'unit',
    config: {
        test: true,
        soap: {
            url: 'http://127.0.0.1:9036',
            uri: '/soap',
            templates: path.resolve(__dirname, 'templates'),
            logLevel: 'error'
        },
        soapSimulator: {
            port: 9036
        }
    },
    params: {
        steps: [
            // {
            //     method: 'soap.operation.test',
            //     name: 'operaion test',
            //     params: {
            //         param: 'param value'
            //     },
            //     result(result, assert) {
            //         assert.same(result, {field: 'field value'}, 'Parse response');
            //     }
            // }
        ]
    }
});
