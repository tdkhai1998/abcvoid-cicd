export default function toFunc(promise) {
  return promise.then(data => [null, data]).catch(e => [e]);
}
