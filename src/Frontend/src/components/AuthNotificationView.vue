<template>
  <transition name="slide-up">
    <div class="overlay-wrapper">
      <div class="content">
        <button class="close-button" @click="closeModal">×</button>
        <div class="icon" v-html="image"></div>
        <p>{{ notificationContent }}</p>
        <button type="button" class="confirm-button" @click="operationConfirmed">
          <span v-if="!isLoading">{{ buttonText }}</span>
          <span
            v-else-if="isLoading && notificationContent.toLowerCase().includes('delete')"
            class="spinner"
          ></span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    image: {
      type: String,
      default: "",
    },
    notificationContent: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "",
    },
  },
  emits: ["confirm"],
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    operationConfirmed() {
      this.isLoading = true;
      this.$emit("confirm");
    },
    closeModal() {
      this.$emit("update:visible", false);
    },
  },
  computed: {
    ...mapGetters(["getDeleteExpenseStatus"]),
  },
  watch: {
    getDeleteExpenseStatus(newVal) {
      if (newVal == true) {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../assets/_base.scss";
.overlay-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  @include flex(row, center, center, 0);
  z-index: 997;

  .content {
    position: relative;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 30rem;
    margin: auto;
    @include flex(column, center, center, 3rem);

    .close-button {
      position: absolute;
      background-color: #bebebe;
      top: 10px;
      right: 10px;
      border: none;
      border-radius: 2rem;
      font-size: 2rem;
      text-align: center;
      cursor: pointer;
      color: black;
      transition: backgorund 0.2s ease;

      &:hover {
        background-color: rgb(243, 82, 82);
      }
    }
    .icon {
      width: 4rem;
      height: 4rem;
    }

    p {
      font-size: 1.6rem;
      font-weight: bold;
      text-align: center;
    }

    .confirm-button {
      width: 100%;
      background-color: #007bff;
      color: white;
      padding: 12px;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background-color: #0056b3;
      }

      .spinner {
        width: 1rem;
        height: 1rem;
        border: 2px solid #fff;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  .slide-up-enter-from,
  .slide-up-leave-to {
    transform: translateY(30px);
    opacity: 0;
  }
}
</style>
