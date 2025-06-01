<template>
  <transition name="slide-up">
    <div class="overlay-wrapper">
      <div class="overlay-form">
        <button class="close-button" @click="closeModal">×</button>
        <h3>{{ opType == 1 ? "Add New Item" : "Update Item" }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Description</label>
            <input
              type="text"
              v-model="formData.description"
              placeholder="Enter description"
              required
            />
            <small v-if="errors.description">{{ errors.description }}</small>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="formData.category" required>
              <option disabled value="">Select a category</option>
              <option v-for="cat in categories" :key="cat.categoryId" :value="cat.categoryName">
                {{ cat.categoryName }}
              </option>
            </select>
            <small v-if="errors.category">{{ errors.category }}</small>
          </div>

          <div class="form-group">
            <label>Amount</label>
            <input type="number" step="0.01" v-model.number="formData.amount" required />
            <small v-if="errors.amount">{{ errors.amount }}</small>
          </div>

          <div v-if="opType != 2" class="form-group">
            <label>Income Date</label>
            <input type="date" v-model="formData.date" required />
            <small v-if="errors.date">{{ errors.date }}</small>
          </div>
          <button type="submit" class="submit-btn">
            <span v-if="!getIsLoading">Submit</span>
            <span v-else class="spinner"></span>
          </button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OverlayForm",
  props: {
    opType: {
      //1 for add 2 for update
      type: Number,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    itemData: {
      type: Object,
      default: () => ({
        description: "",
        amount: 0,
        category: "",
        date: new Date(),
      }),
    },
    categories: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formData: { ...this.itemData },
      errors: {},
    };
  },
  methods: {
    handleSubmit() {
      this.errors = {};
      if (!this.formData.description) this.errors.description = "Description is required";
      if (!this.formData.category) this.errors.category = "Category is required";
      if (!this.formData.amount) this.errors.amount = "Amount is required";
      if (Object.keys(this.errors).length === 0) {
        console.log(this.formData);
        this.$emit("submit", this.formData);
      }
    },
    closeModal() {
      this.$emit("update:visible", false);
    },
  },
  computed: {
    ...mapGetters(["getIsLoading"]),
  },
  watch: {
    itemData(newVal) {
      this.formData = { ...newVal };
    },
    modelValue(newVal) {
      if (newVal) {
        this.formData = { ...this.itemData };
      }
    },
    getIsLoading(newVal) {
      console.log(newVal);
      if (newVal == false) {
        this.closeModal();
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

  .overlay-form {
    position: relative;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    margin: auto;

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

    h3 {
      margin-bottom: 20px;
      font-size: 1.25rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-weight: 500;
      font-size: 1rem;
    }

    input,
    select {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 0.95rem;
      box-sizing: border-box;
    }

    small {
      display: block;
      margin-top: 4px;
      color: #e63946;
      font-size: 0.8rem;
    }

    .submit-btn {
      width: 100%;
      background-color: #007bff;
      color: white;
      padding: 12px;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }

    .submit-btn:hover {
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

    @keyframes spin {
      to {
        transform: rotate(360deg);
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
