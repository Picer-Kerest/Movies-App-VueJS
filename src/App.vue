<template>
  <div id="app">
    <Loader/>
    <Notification/>
    <PosterBg :poster="posterBg" />
    <Header/>
    <MoviesList :list="moviesList" @changePoster="onChangePoster" />
    <MoviesPagination :current-page="currentPage" :per-page="moviesPerPage" :total="moviesLength" @pageChanged="onPageChanged"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MoviesList from "@/components/MoviesList";
import PosterBg from "@/components/PosterBg";
import MoviesPagination from "@/components/MoviesPagination";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Notification from "@/components/Notification";

export default {
  name: 'App',
  components: {
    MoviesList,
    PosterBg,
    MoviesPagination,
    Loader,
    Header,
    Notification,
  },
  data: () => ({
    posterBg: '',
  }),
  computed: {
    ...mapGetters('movies', ['moviesList', 'currentPage', 'moviesPerPage', 'moviesLength',]),
  },
  // mounted() {
  //  Ставится перед методами, чтобы было удобнее читать
  //   this.fetchMovies();
  //  В данный момент мы получаем данные при загрузке конкретной компоненты,
  //  а мы хотим получать данные при загрузке приложения
  // },
  watch: {
    '$route.query': {
      handler: 'onPageQueryChange',
      // Каждый раз когда будет меняться query, у нас будет отрабатывать onPageQueryChange
      immediate: true,
      deep: true,
    //  deep: true Чтобы слежение реагировало на изменения во вложенных объектах,
    //  Если передано immediate: true, коллбэк будет вызван сразу же после начала наблюдения с текущим значением выражения
    },
  },
  methods: {
    ...mapActions('movies', ['changeCurrentPage', ]),
    onPageQueryChange({ page = 1 }) {
      // Делаем либо через обработчик watch, либо через created() hock
      this.changeCurrentPage(Number(page));
    },
    onChangePoster(poster) {
      this.posterBg = poster;
    },
    onPageChanged(page) {
      this.$router.push({query: {page}});
      // this.changeCurrentPage(page);
    },
  },
  // created() {
  //   if (this.$route.query.page) {
  //     this.changeCurrentPage(Number(this.$route.query.page));
  //   }
  // },
}
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
