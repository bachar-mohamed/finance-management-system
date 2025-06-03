<template>
  <section class="authentication-container">
    <div class="forms">
      <section class="authentication-forms-container">
        <transition name="fade-slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "../assets/_base.scss";

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(50px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.authentication-container {
  width: 100%;
  height: calc(100vh - 5rem);
  background: linear-gradient(to right bottom, #e8a5e8, #94c7f2);

  header {
    width: 100%;
    height: 5rem;
    background-color: $blue;
    @include flex(row, flex-end, center, 2rem);
  }

  .authentication-forms-container {
    width: 100%;
    height: calc(100vh - 10rem);
    @include flex(row, center, center, 0rem);

    .forms {
      padding: 2rem;
      width: 100%;
      height: calc(100% - 3rem);
      @include flex(row, flex-start, center, 0rem);
    }
  }
}
</style>
