# **SOAP Port:** `ut-port-soap`

Invoke SOAP APIs with templates.
Loads templates from the `templates` folder passed via the port configuration
See `ut-function.template` and `ut-function.xml2json` for more details about
template processing.

## Example usage

```js
const path = require('path');

class merchant extends require('ut-port-soap')(...arguments) {
    get defaults() {
        return {
            namespace: 'merchant',
            url: 'http://merchant:8480',
            uri: '/services',
            templates: path.join(__dirname, 'templates')
        };
    }
};
```

See `test/templates` folder for example templates.
