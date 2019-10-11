const fs = require('fs');
const { resolve } = require('path');
const Sequelize = require('sequelize');

module.exports = (() => {
    let instance;

    function initConnection() {
        const client = new Sequelize('loon', 'root', 'root', {
            host: 'localhost',
            dialect: 'mysql'
        });

        const models = {};

        function getModels() {
            fs.readdir('./database/models', (err, file) => {
                file.forEach(file => {
                    const modelName = file.split('.')[0];

                    models[modelName] = client.import(resolve(`./database/models/${modelName}`));
                });
            });
        }

        return {
            setModels: () => getModels(),
            getModel: modelName => models[modelName]
        };
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = initConnection();
            }

            return instance;
        }
    };
})();