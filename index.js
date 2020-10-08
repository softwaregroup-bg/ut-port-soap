const path = require('path');
const errors = require('./errors.json');
const template = require('ut-function.template');
const xml2json = require('ut-function.xml2json');

module.exports = function({ registerErrors, vfs }) {
    return class soap extends require('ut-port-http')(...arguments) {
        get defaults() {
            return {
                namespace: 'soap',
                method: 'POST',
                parseResponse: false,
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8'
                }
            };
        }

        get schema() {
            return {
                type: 'object',
                required: ['templates'],
                properties: {
                    templates: {
                        type: 'string'
                    }
                }
            };
        }

        async init(...params) {
            const initResult = await super.init(...params);
            Object.assign(this.errors, registerErrors(errors));
            return initResult;
        }

        async start() {
            const result = await super.start(...arguments);
            const templateFolder = this.config.templates;

            const load = (name, type) => {
                const xml = vfs.readFileSync(name).toString();
                if (type === 'request') return template(xml, ['params'], {}, '');
                if (type === 'response') return xml2json(xml);
            };

            this.templates = await new Promise((resolve, reject) => {
                const dir = this.config.templates;
                vfs.readdir(dir, (error, files) => {
                    if (error) return reject(error);
                    resolve(files.reduce((prev, file) => {
                        const match = file.match(/^(.*\.(request|response))\.xml$/);
                        if (match) {
                            prev[path.basename(match[1])] = load(path.join(dir, file), match[2]);
                        }
                        return prev;
                    }, {}));
                });
            });

            this.templatesPath = {};

            await vfs.readdir(templateFolder, (error, files) => {
                if (error) return error;

                files.forEach((element) => {
                    this.templatesPath[element] = `${templateFolder}${path.sep}${element}`;
                });
            });

            return result;
        }

        handlers() {
            return {
                send: (params, {method}) => {
                    method = `${method}.request`;
                    const request = this.templates[method];
                    if (!request) throw this.bus.errors['bus.methodNotFound']({params: {method}});
                    return {
                        payload: request(params)
                    };
                },
                receive: ({payload}, {method, mtid}) => {
                    method = `${method}.response`;
                    const response = this.templates[method];
                    if (!response) throw this.bus.errors['bus.methodNotFound']({params: {method}});
                    return response(payload, this.templatesPath[`${method}.xml`]);
                }
            };
        }
    };
};
