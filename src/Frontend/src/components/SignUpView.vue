<template>
  <auth-notification-view
    v-if="isVisible"
    v-model:visible="isVisible"
    :image="source"
    :notificationContent="text"
    :buttonText="buttonContent"
    @confirm="handleClick"
  ></auth-notification-view>
  <card-view>
    <template v-slot:default>
      <form action="post" class="signup-form">
        <h1 class="signup-title">User Sign Up</h1>
        <div class="form-group">
          <label for="username" class="form-label">Username</label>
          <div class="input-container">
            <input
              type="text"
              v-model="userName"
              id="username"
              class="form-input"
              placeholder="Enter your username"
            />
          </div>
          <small v-if="emptyUserName" class="error-message">Please provide a username</small>
        </div>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <div class="input-container">
            <input
              type="email"
              :class="['form-input', { 'input-error': wrongInput }]"
              v-model="email"
              id="email"
              placeholder="Enter your email address"
            />
            <small v-if="wrongInput" class="error-message"
              >Please enter a valid email address</small
            >
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-container">
            <input
              type="password"
              :class="['form-input', { 'input-error': wrongConfirmation }]"
              v-model="password"
              id="password"
              placeholder="Create a strong password"
              @input="checkPasswordStrength"
            />
          </div>
          <div class="password-strength-container">
            <div class="strength-bars">
              <div v-for="n in 4" :key="n" :class="['strength-bar', getStrengthBarClass(n)]"></div>
            </div>
            <span class="strength-text" :class="strengthTextClass">{{ strengthText }}</span>
          </div>
        </div>
        <div class="form-group">
          <label for="confirm_password" class="form-label">Confirm Password</label>
          <div class="input-container">
            <input
              type="password"
              :class="['form-input', { 'input-error': wrongConfirmation }]"
              v-model="confirmation"
              id="confirm_password"
              placeholder="Confirm your password"
            />
            <small v-if="wrongConfirmation" class="error-message">Passwords do not match</small>
          </div>
        </div>

        <button @click.prevent="formValidator" class="signup-button">
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <div class="login-link">
        <p>Already have an account?</p>
        <span @click="switchToLogin" class="login-text">Login</span>
      </div>
    </template>
  </card-view>
</template>

<script>
import { mapGetters } from "vuex";
import CardView from "./CardView.vue";
import AuthNotificationView from "./AuthNotificationView.vue";

export default {
  components: { CardView, AuthNotificationView },
  data() {
    return {
      success: false,
      isLoading: false,
      buttonContent: "",
      text: "",
      source: "",
      isVisible: false,
      userName: "",
      email: "",
      password: "",
      confirmation: "",
      emptyUserName: false,
      wrongInput: false,
      wrongConfirmation: false,
      passwordStrength: 0, // 0: none, 1: weak, 2: medium, 3: strong, 4: very strong
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getNotificationIcons"]),

    strengthText() {
      const texts = ["", "Weak", "Medium", "Strong", "Very Strong"];
      return texts[this.passwordStrength];
    },

    strengthTextClass() {
      const classes = ["", "text-danger", "text-warning", "text-success", "text-success"];
      return classes[this.passwordStrength];
    },

    isPasswordStrong() {
      return this.passwordStrength >= 3;
    },
  },
  methods: {
    handleClick() {
      if (this.success) {
        this.isVisible = false;
        this.switchToLogin();
      } else {
        this.isVisible = false;
      }
      this.isLoading = false;
    },
    switchToLogin() {
      this.$router.push("login");
    },

    emailValidator(silent = false) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        if (!silent) this.wrongInput = true;
        return false;
      } else {
        if (!silent) this.wrongInput = false;
        return true;
      }
    },

    checkPasswordStrength() {
      let strength = 0;
      if (this.password.length === 0) {
        this.passwordStrength = strength;
        return;
      }
      if (this.password.length >= 8) strength += 1;
      if (this.password.length >= 12) strength += 1;
      if (/[a-z]/.test(this.password) && /[A-Z]/.test(this.password)) strength += 1;
      if (/\d/.test(this.password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(this.password)) strength += 1;
      this.passwordStrength = Math.min(4, strength);
    },
    getStrengthBarClass(barIndex) {
      if (this.passwordStrength >= barIndex) {
        if (this.passwordStrength === 1) return "strength-weak";
        if (this.passwordStrength === 2) return "strength-medium";
        if (this.passwordStrength >= 3) return "strength-strong";
      }
      return "";
    },

    async formValidator() {
      if (this.userName == "") {
        this.emptyUserName = true;
        return;
      }
      this.emptyUserName = false;
      this.emailValidator();
      if (this.password !== this.confirmation) {
        this.wrongConfirmation = true;
        return;
      }
      if (!this.isPasswordStrong) {
        return;
      }
      this.isLoading = true;
      const body = {
        userName: this.userName,
        email: this.email,
        password: this.password,
      };
      await this.$store.dispatch("registerUser", body);
      if (this.getUserId != -1) {
        this.success = true;
        this.buttonContent = "Login";
        this.text = "Account Created Successfully!";
        this.source = this.getNotificationIcons[0];
        this.isVisible = true;
      } else {
        this.success = false;
        this.buttonContent = "OK";
        this.text = "Email Already Used!";
        this.source = this.getNotificationIcons[1];
        this.isVisible = true;
      }
      this.wrongConfirmation = false;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/_base";

/* Main title styling */
.signup-title {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: white;
  text-align: center;
  font-weight: 600;
}

/* Form container styling */
.signup-form {
  @include flex(column, stretch, stretch, 1.5rem);
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  background-color: transparent;
}

/* Form group styling */
.form-group {
  @include flex(column, flex-start, stretch, 0.5rem);
  width: 100%;
}
.form-label {
  font-size: 1.1rem;
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
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
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

/* Password strength indicator container */
.password-strength-container {
  margin-top: 0.5rem;
  @include flex(column, flex-start, stretch, 0.25rem);
}

/* Strength bars container */
.strength-bars {
  @include flex(row, flex-start, center, 0.25rem);
  width: 100%;
  height: 8px;
}

/* Individual strength bar styling */
.strength-bar {
  flex: 1;
  height: 100%;
  background-color: #eee;
  border-radius: 4px;
  transition: all 0.3s ease;

  &.strength-weak {
    background-color: #e74c3c;
  }

  &.strength-medium {
    background-color: #f39c12;
  }

  &.strength-strong {
    background-color: #2ecc71;
  }
}

/* Strength text styling */
.strength-text {
  font-size: 0.8rem;
  font-weight: 600;

  &.text-danger {
    color: #e74c3c;
  }

  &.text-warning {
    color: #f39c12;
  }

  &.text-success {
    color: #2ecc71;
  }
}

/* Submit button styling */
.signup-button {
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

/* Login link section styling */
.login-link {
  @include flex(row, center, center, 0.5rem);
  padding: 1rem;
  border-radius: 8px;

  p {
    font-size: 1.2rem;
    margin: 0;
    color: white;
    font-weight: bold;
  }

  .login-text {
    color: #4a90e2;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #3a7bc8;
      text-decoration: underline;
    }
  }
}

/* Media queries for responsive design */
@media (max-width: 768px) {
  .signup-form {
    padding: 1.5rem;
  }

  .signup-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .signup-form {
    padding: 1rem;
  }

  .form-input {
    padding: 0.6rem 0.8rem;
  }

  .signup-button {
    padding: 0.6rem 1.2rem;
  }
}
</style>
