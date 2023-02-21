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

const { MOVIES, CURRENT_PAGE } = mutations;

const moviesStore = {
    namespaced: true,
    state: {
        top250IDs: IDs,
        moviesPerPage: 12,
        currentPage: 1,
        movies: {},
    },
    getters: {
        moviesList: ({ movies }) => movies,
        slicedIDs: ({ top250IDs }) => (from, to) => top250IDs.slice(from, to),
    //    https://digitalfortress.tech/js/whats-a-double-arrow-function-in-javascript/
        currentPage: ({ currentPage }) => currentPage,
        moviesPerPage: ({ moviesPerPage }) => moviesPerPage,
        moviesLength: ({ top250IDs }) => Object.keys(top250IDs).length,
    },
    mutations: {
        [MOVIES](state, value) {
          //  Первый аргумент - state. Второй аргумент - значение
          state.movies = value;
        },
        [CURRENT_PAGE](state, value) {
          state.currentPage = value;
        },
    },
    actions: {
        initMoviesStore: {
            // Данный метод будет вынесен из модуля и будет доступен откуда-угодно
            // Мы даём возможность вызвать метод из другого места - корневой сторы
            // В данный момент можно вызвать только из store movies
            handler({ dispatch }) {
            // handler принимает context
                dispatch('fetchMovies');
            //    Теперь можно вызвать из index.js нашей store
            },
            root: true,
        },
        async fetchMovies({ getters, commit, dispatch }) {
            try {
                dispatch('toggleLoader', true, { root: true });
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
    },
}

export default moviesStore;