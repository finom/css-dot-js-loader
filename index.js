const { NodeVM, VMScript } = require('vm2');

const vm = new NodeVM({
  console: 'inherit',
  sandbox: {},
  require: {
    context: 'sandbox',
    external: true,
    builtin: ['*'],
    mock: {},
  },
});

const vmCache = {};
const extract = (code, filename = 'unknown.css.js') => {
  // extract cached script if exists
  const { cachedCode, cachedScript } = vmCache[filename] || {};
  // if cached code equals to actual code then assign cached script
  // else create new script
  const script = cachedCode && cachedCode === code ? cachedScript : new VMScript(code);
  // execute
  const result = vm.run(script, filename);
  // save results to cache
  vmCache[filename] = { cachedCode: code, cachedScript: script };

  // support for esmodule exports
  return result.__esModule ? result.css || result.default : result.css || result;
};

module.exports = function (source, { sources }) {
  return extract(source, sources[0]);
};
