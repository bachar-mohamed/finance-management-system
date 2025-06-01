<template>
  <div class="notificationContainer">
    <dialog>
      <img :src="source" alt="" class="icon" />
      <h1>{{ message }}</h1>
      <button>{{ button_text }}</button>
    </dialog>
  </div>
</template>

<script>
export default {
  props: ["message", "button_text", "source"],
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/_base.scss";
.notificationContainer {
  position: absolute;
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 18, 15, 0.8);
  backdrop-filter: blur(5px);
  @include flex(row, center, center, 0rem);

  dialog {
    width: 30rem;
    height: 15rem;
    @include flex(column, space-around, center, 0rem);
    background-color: #124e66;
    border-radius: 1rem;
    border-color: transparent;
  }
}
</style>
