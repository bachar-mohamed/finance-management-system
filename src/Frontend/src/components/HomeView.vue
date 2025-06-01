<template>
  <header-view></header-view>
  <section class="home_section">
    <router-view></router-view>
  </section>
</template>

<script>
import HeaderView from "@/components/HeaderView";
export default {
  components: {
    HeaderView
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/_base.scss";
.home_section{
  border: 2px solid green;
  width: 100%;
  height: 100%;
  @include flex(row,flex-start,center,1rem)
}
</style>
