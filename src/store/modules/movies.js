import IDs from '../mock/imdb_top250';
import axios from "@/plugins/axios";
import mutations from "@/store/mutations";

function serializeResponse(movies) {
    return movies.reduce((acc, movie) => {
        // id: instance
        acc[movie.imdbID] = movie;
        return acc;
    }, {});
}

const { MOVIES, CURRENT_PAGE, REMOVE_MOVIE, TOGGLE_SEARCH } = mutations;

const moviesStore = {
    namespaced: true,
    state: {
        top250IDs: IDs,
        moviesPerPage: 12,
        currentPage: 1,
        movies: {},
        isSearch: false,
    },
    getters: {
        moviesList: ({ movies }) => movies,
        slicedIDs: ({ top250IDs }) => (from, to) => top250IDs.slice(from, to),
    //    https://digitalfortress.tech/js/whats-a-double-arrow-function-in-javascript/
        currentPage: ({ currentPage }) => currentPage,
        moviesPerPage: ({ moviesPerPage }) => moviesPerPage,
        moviesLength: ({ top250IDs }) => Object.keys(top250IDs).length,
        isSearch: ({ isSearch }) => isSearch,
    },
    mutations: {
        [MOVIES](state, value) {
          //  Первый аргумент - state. Второй аргумент - значение
          state.movies = value;
        },
        [CURRENT_PAGE](state, value) {
          state.currentPage = value;
        },
        [REMOVE_MOVIE](state, index) {
          state.top250IDs.splice(index, 1);
          //  Начиная с элемента index удаляет его в количестве 1 штука
            //  В итоге у нас будет тот же массив, но без этого элемента
            //  splice возвращает удалённый элемент
        },
        [TOGGLE_SEARCH](state, bool) {
            state.isSearch = bool;
        },

    },
    actions: {
        // initMoviesStore: {
        //     // Данный метод будет вынесен из модуля и будет доступен откуда-угодно
        //     // Мы даём возможность вызвать метод из другого места - корневой сторы
        //     // В данный момент можно вызвать только из store movies
        //     handler({ dispatch }) {
        //     // handler принимает context
        //         dispatch('fetchMovies');
        //     //    Теперь можно вызвать из index.js нашей store
        //     },
        //     root: true,
        // },
        // Метод убираем, потому что происходит двойной запрос
        async fetchMovies({ commit, dispatch, getters }) {
            try {
                dispatch('toggleLoader', true, { root: true });
                // У нас store loader - глобальная, поэтому нам нужен root true, чтобы искать в глобальном пространстве
                const { currentPage, moviesPerPage, slicedIDs } = getters;
                const from = currentPage * moviesPerPage - moviesPerPage;
                const to = currentPage * moviesPerPage;
                const moviesToFetch = slicedIDs(from, to);
                // Бывают случаи когда на сервере поддерживается множественная передача одного и того же параметра
                // Множество раз. У нас это не поддерживается, поэтому нужно сделать 12 запросов
                const requests = moviesToFetch.map(id => axios.get(`/?i=${id}`));
                // Получим массив промисов. Но они без await'a, значит не будут выполняться
                const response = await Promise.all(requests);
                //    Получаем ответы от сервера.
                //    Чтобы не выгружать лишние данные, нужно сделать так, чтобы выгружались только данные с фильмами.
                //    Сделаем это в axios, чтобы не сломать логику приложения.
                //    Теперь у нас ответ будет выдавать только data, то есть данные с фильмом
                const movies = serializeResponse(response);
                commit('MOVIES', movies);
            } catch (err) {
                console.log(err);
            } finally {
                dispatch('toggleLoader', false, { root: true });
            }
        },
        changeCurrentPage({ commit, dispatch }, page) {
            commit('CURRENT_PAGE', page);
            dispatch('fetchMovies');
        },
        removeMovie({ commit, dispatch, state }, id) {
        //    Для начала нужно получить index
            const index = state.top250IDs.findIndex(item => item === id);
        //    https://wm-school.ru/js/array_findindex.php
        //    Возвращает индекс первого элемента в массиве, который соответствует условию в переданной функции.
            if (index !== -1) {
                // -1 вернёт findIndex если ничего не найдёт
                commit('REMOVE_MOVIE', index);
                dispatch('fetchMovies');
            }
        },
        async searchMovies({ commit, dispatch }, query) {
            try {

                dispatch('toggleLoader', true, { root: true });
                const response = await axios.get(`/?s=${query}`);
                if (response.Error) {
                    throw new Error(response.Error);
                //    Прекратит работу функции. Return писать не нужно
                }
                const movies = serializeResponse(response.Search);
                commit('MOVIES', movies);
            } catch (err) {
                dispatch('showNotify', {
                    msg: err.message,
                    title: 'Search Error',
                    variant: 'danger',
                }, { root: true });
            } finally {
                dispatch('toggleLoader', false, { root: true });
            }
        },
        toggleSearchState({ commit}, bool) {
            commit('TOGGLE_SEARCH', bool);
        },
    },
}

export default moviesStore;