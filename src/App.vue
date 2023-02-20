<template>
  <div id="app">
    <MoviesList :list="moviesList"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import MoviesList from "@/components/MoviesList";

export default {
  name: 'App',
  components: {
    MoviesList,
  },
  computed: {
    ...mapGetters('movies', ['moviesList', ]),
  },
  // mounted() {
  //  Ставится перед методами, чтобы было удобнее читать
  //   this.fetchMovies();
  //  В данный момент мы получаем данные при загрузке конкретной компоненты,
    //  а мы хотим получать данные при загрузке приложения
  // },
  methods: {
    ...mapActions('movies', ['fetchMovies', ]),
  },
}
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
