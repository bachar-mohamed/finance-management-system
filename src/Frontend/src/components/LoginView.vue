<template>
  <auth-notification-view
    v-if="isVisible"
    v-model:visible="isVisible"
    :image="source"
    :notificationContent="text"
    :buttonText="buttonContent"
    @confirm="setIsVisible"
  ></auth-notification-view>
  <card-view>
    <template v-slot:default>
      <form action="post" class="login-form">
        <h1 class="login-title">User Login</h1>
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="input-container">
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-input"
              :class="{ 'input-error': emailError }"
              placeholder="Enter your email address"
              required
            />
            <small v-if="emailError" class="error-message"
              >Please enter a valid email address</small
            >
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-container">
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button @click.prevent="authenticateUser" class="login-button">
          <span v-if="!isLoading">Login</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <div class="signup-link">
        <p>Don't have an account?</p>
        <span @click="switchToSignup" class="signup-text">Sign up</span>
      </div>
    </template>
  </card-view>
</template>

<script>
import CardView from "./CardView.vue";
import AuthNotificationView from "./AuthNotificationView.vue";
import { mapGetters } from "vuex";

export default {
  components: { CardView, AuthNotificationView },
  emits: ["error-msg"],
  data() {
    return {
      isVisible: false,
      isLoading: false,
      buttonContent: "",
      text: "",
      source: "",
      email: "",
      password: "",
      emailError: false,
    };
  },
  methods: {
    emailValidator() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = true;
        return false;
      } else {
        this.emailError = false;
        return true;
      }
    },
    switchToSignup() {
      this.$router.push("sign-up");
    },
    async authenticateUser() {
      if (!this.emailValidator()) return;
      this.isLoading = true;
      const payload = {
        email: this.email,
        password: this.password,
      };
      try {
        await this.$store.dispatch("authenticateUser", payload);
        if (this.getUserId != -1) {
          this.$router.push("/home/expenses");
        } else {
          this.buttonContent = "OK";
          this.text = "Wrong email or password. Please try again!";
          this.source = this.getNotificationIcons[1];
          this.setIsVisible();
        }
      } catch (error) {
        this.buttonContent = "OK";
        this.text = "Login failed. Please try again later.";
        this.source = this.getNotificationIcons[1];
        this.setIsVisible();
      }
      this.isLoading = false;
    },
    setIsVisible() {
      this.isVisible = !this.isVisible;
    },
  },
  computed: {
    ...mapGetters(["getUserId", "getNotificationIcons"]),
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
@import "../assets/_base";

/* Main title styling */
.login-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
  font-weight: 600;
}

/* Form container styling */
.login-form {
  @include flex(column, stretch, stretch, 1.5rem);
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  border-radius: 8px;
}

/* Form group styling */
.form-group {
  @include flex(column, flex-start, stretch, 0.5rem);
  width: 100%;
}

/* Label styling */
.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
}

/* Input container styling */
.input-container {
  position: relative;
  width: 100%;
}

/* Input field styling */
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
    background-color: #fff;
  }

  &::placeholder {
    color: #aaa;
    font-size: 0.9rem;
  }
}

/* Error state for input fields */
.input-error {
  border-color: #e74c3c;

  &:focus {
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
  }
}

/* Error message styling */
.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* Login button styling */
.login-button {
  margin-top: 1rem;
  padding: 2rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 20rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #3a7bc8;
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

/* Sign up link section styling */
.signup-link {
  @include flex(row, center, center, 0.5rem);
  font-size: 1.2rem;
  padding: 1rem;
  border-radius: 8px;

  p {
    margin: 0;
    color: white;
    font-size: 1.2rem;
  }

  .signup-text {
    color: #4a90e2;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #3a7bc8;
      text-decoration: underline;
    }
  }
}

/* Custom notification styling */
.custom-notification {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  .login-form {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1rem;
  }

  .form-input {
    padding: 0.6rem 0.8rem;
  }

  .login-button {
    padding: 0.6rem 1.2rem;
  }
}
</style>
