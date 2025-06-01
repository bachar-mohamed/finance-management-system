<template>
  <footer>
  <h1>All rights reserved</h1>
  </footer>
</template>

<script>
export default {

}
</script>


<style lang="scss">
@import "../assets/_base.scss";

footer{
  width: 100%;
  height: 5rem;
  background-color: $light-grey;

  h1{
    font-size: map-get($font-weights,medium);
  }
}
</style>