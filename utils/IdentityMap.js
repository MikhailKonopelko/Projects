export default class IdentityMap {
  constructor() {
    this._store = new Map();
  }

  _makeKey(namespace, id) {
    return `${namespace}:${id}`;
  }

  get(namespace, id) {
    return this._store.get(this._makeKey(namespace, id));
  }

  set(namespace, id, value) {
    this._store.set(this._makeKey(namespace, id), value);
    return value;
  }

  has(namespace, id) {
    return this._store.has(this._makeKey(namespace, id));
  }

  async getOrLoad(namespace, id, loader) {
    const key = this._makeKey(namespace, id);
    if (this._store.has(key)) return this._store.get(key);
    const value = await loader();
    this._store.set(key, value);
    return value;
  }
}


