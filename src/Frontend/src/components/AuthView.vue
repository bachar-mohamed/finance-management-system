<template>
  <section class="authentication-container">
    <header>
      <router-link to="sign-up">Sign-Up</router-link>
      <router-link to="login">login</router-link>
    </header>
    <div class="forms">
      <section class="authentication-forms-container">
        <router-view></router-view>
      </section>
    </div>
  </section>
</template>


<script>
export default {
  data() {
    return {}
  },
  methods: {},
  computed: {}, watch: {},
}
</script>


<style lang="scss" scoped>
@import "../assets/_base.scss";

.authentication-container {
  width: 100%;
  height: calc(100vh - 5rem);
  background: linear-gradient(to right bottom, purple,blue);

  header {
    width: 100%;
    height: 5rem;
    background-color: $blue;
    @include flex(row, flex-end, center, 2rem)
  }

  .authentication-forms-container {
    width: 100%;
    height: calc(100vh - 10rem);
    @include flex(row,center,center,0rem);

    .forms {
      padding: 2rem;
      width: 100%;
      height: calc(100% - 3rem);
      @include flex(row, flex-start, center, 0rem)
    }

  }
}

</style>
