<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="scss" scoped>
@import "../assets/_base";
div {
  @include flex(column, flex-start, center, 2rem);
  background-color: transparent;
  width: 30rem;
}
</style>
