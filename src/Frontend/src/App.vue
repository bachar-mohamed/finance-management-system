<template>
  <main>
    <RouterView></RouterView>
  </main>
  <footer-view></footer-view>
</template>

<script>
import FooterView from "@/components/FooterView";
export default {
  components: { FooterView },
};
</script>

<style lang="scss">
@import "./assets/_base";

html {
  font-size: 62.5%;
  font-family: "Lexend", sans-serif;
}
* {
  box-sizing: border-box;
  margin: 0;
}
main {
  @include flex(column, flex-start, center, 0rem);
  overflow: hidden;
  border: 2px solid red;
}
</style>
