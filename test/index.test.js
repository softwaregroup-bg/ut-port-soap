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
            templates: path.resolve(__dirname, 'templates'),
            logLevel: 'error',
            openApi: {
                soap: path.resolve(__dirname, 'mock', 'soap.json')
            }
        },
        soapSimulator: {
            port: 9036
        }
    },
    params: {
        steps: [
            // todo fix node 16 testing
            // {
            //     method: 'soap.operation.test',
            //     name: 'operation test',
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
