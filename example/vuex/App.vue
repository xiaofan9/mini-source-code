<template>
  <div id="app">
    {{$store.getters.test}} + 1
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    this.$store.commit('test', 1111)

    this.$store.dispatch('test', 111).then((msg) => {
      console.log(msg);
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
