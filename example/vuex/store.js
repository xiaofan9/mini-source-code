import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    test: 111,
  },
  getters: {
    test(state, getters) {
      return state.test + getters.test1
    },
    test1 () {
      return '11000af'
    }
  },
  mutations: {
    test(state, msg) {
      console.log(65 + msg)
    },
  },
  actions: {
    test(store, msg) {
      console.log(msg);

      return Promise.resolve('测试1');
    }
  }
})
