import applyMixin from "./mixin";
import { forEachValue, partial, isObject, isPromise } from "./util";

let Vue;

export class Store {
  constructor(options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== "undefined" && window.Vue) {
      install(window.Vue);
    }

    this.getters = Object.create(null);
    this.mutations = Object.create(null);
    this.actions = Object.create(null);

    const computed = {};
    const { state, getters, mutations, actions } = options;

    forEachValue(getters, (fn, key) => {
      // use computed to leverage its lazy-caching mechanism
      // direct inline function use will lead to closure preserving oldVm.
      // using partial to return function with only arguments preserved in closure environment.
      computed[key] = partial(() => fn(this.state, this.getters), this);

      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
        enumerable: true, // for local getters
      });
    });

    forEachValue(mutations, (fn, key) => {
      const entry = this.mutations[key] || (this.mutations[key] = [])
      const store = this;
      
      entry.push(function wrappedMutationHandler(payload) {
        fn.call(store, store.state, payload);
      })
    });

    forEachValue(actions, (fn, key) => {
      const entry = this.actions[key] || (this.actions[key] = [])
      const store = this;
      
      entry.push(function wrappedActionHandler(payload) {
        let res = fn.call(store, store, payload);

        if (!isPromise(res)) {
          res = Promise.resolve(res)
        }

        return res;
      })
    });

    this._vm = new Vue({
      data: {
        $$state: state,
      },
      computed,
    });
  }

  get state() {
    return this._vm._data.$$state;
  }

  commit(_type, _payload, _options) {
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload, _options)

    const entry = this.mutations[type]
    if (!entry) {
      return
    }

    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  }

  dispatch (_type, _payload) {
    // check object-style dispatch
    const {
      type,
      payload
    } = unifyObjectStyle(_type, _payload)

    const entry = this.actions[type]
    if (!entry) {
      return
    }

    const result = entry.length > 1
      ? Promise.all(entry.map(handler => handler(payload)))
      : entry[0](payload)

    return new Promise((resolve, reject) => {
      result.then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  return { type, payload, options }
}

export function install(_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[vuex] already installed. Vue.use(Vuex) should be called only once."
      );
    }
    return;
  }
  Vue = _Vue;
  applyMixin(Vue);
}
