<template>
  <!--通过router-view把组件加载进来-->
  <router-view></router-view>
</template>
<script >
export default {
  name: 'App',
  components: {
  }
}
</script>
<style>
/*
设置全局样式
*/
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>