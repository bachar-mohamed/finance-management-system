<template>
  <header-view></header-view>
  <section class="home_section">
    <transition name="fade-slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
import HeaderView from "@/components/HeaderView";
export default {
  components: {
    HeaderView,
  },
  data() {
    return {};
  },
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
.home_section {
  width: 100%;
  height: 100%;
  background: linear-gradient(to right bottom, #94c7f2, #e8a5e8);
  @include flex(row, flex-start, center, 1rem);
}
</style>
