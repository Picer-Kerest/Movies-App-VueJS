<template>
  <div class="loader-wrap" v-if="isShowLoader">
    <BSpinner type="grow" variant="light"></BSpinner>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Loader",
  computed: {
    ...mapGetters(['isShowLoader', ]),
  //  Так как store loader глобальная, то имя можно не указывать
  },
}
</script>

<style scoped>
.loader-wrap {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
</style>