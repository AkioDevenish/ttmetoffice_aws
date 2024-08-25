// config-overrides.js
const path = require('path');
const { addAlias } = require('react-app-rewire-alias');

module.exports = function override(config, env) {
  addAlias({
    '@tailwindConfig': path.resolve(__dirname, 'tailwind.config.js'),
  })(config);
  return config;
};