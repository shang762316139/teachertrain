<template>
  <div id="app">
    <Activity />
  </div>
</template>
<script>
import Activity from "./views/Activity";
export default {
  components: {
    Activity,
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
