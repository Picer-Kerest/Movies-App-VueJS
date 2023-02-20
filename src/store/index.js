import Vue from 'vue'
import Vuex from 'vuex'
import movies from './modules/movies';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    movies,
  }
})

store.dispatch('initMoviesStore');
// Теперь у нас сразу же будет идти вызов initMoviesStore, а initMoviesStore будет вызывать fetchMovies

export default store;