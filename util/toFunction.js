const toFunc = promise => {
  return promise.then(data => [null, data]).catch(e => [e]);
}
module.exports = toFunc;
