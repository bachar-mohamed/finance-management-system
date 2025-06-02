<template>
  <section class="account_container">
    <h2>User Account Settings</h2>
    <div class="account-settings">
      <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>

      <div class="form-group">
        <label>Full Name:</label>
        <div class="input-wrapper">
          <input
            type="text"
            v-model="user.fullName"
            @blur="validateField('fullName')"
            :readonly="!isEditing"
            :class="{ editable: isEditing }"
          />
          <button v-if="!isEditing" class="edit-button" @click="toggleEdit">✏️</button>
        </div>
        <span v-if="errors.fullName" class="error">{{ errors.fullName }}</span>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <div class="input-wrapper">
          <input
            type="email"
            v-model="user.email"
            @blur="validateField('email')"
            :readonly="!isEditing"
            :class="{ editable: isEditing }"
          />
          <button v-if="!isEditing" class="edit-button" @click="toggleEdit">✏️</button>
        </div>
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      <button @click="saveProfile">Save Profile</button>

      <hr class="divider" />

      <div class="controller-container" v-if="!passwordChangeMode">
        <h3>Change Password</h3>
        <button @click="requestPasswordChange">Change Password ?</button>
      </div>
      <div v-else class="password-change-form">
        <div class="form-group">
          <label>Current Password:</label>
          <input type="password" v-model="passwordForm.currentPassword" />
          <span v-if="passwordErrors.currentPassword" class="error">{{
            passwordErrors.currentPassword
          }}</span>
        </div>

        <div class="form-group">
          <label>New Password:</label>
          <input type="password" v-model="passwordForm.newPassword" />
          <span v-if="passwordErrors.newPassword" class="error">{{
            passwordErrors.newPassword
          }}</span>
        </div>

        <div class="form-group">
          <label>Confirm New Password:</label>
          <input type="password" v-model="passwordForm.confirmNewPassword" />
          <span v-if="passwordErrors.confirmNewPassword" class="error">{{
            passwordErrors.confirmNewPassword
          }}</span>
        </div>

        <button @click="submitNewPassword">Submit</button>
        <button @click="cancelPasswordChange" class="secondary">Cancel</button>
      </div>

      <hr class="divider" />
      <div class="controller-container">
        <div>
          <h3>Delete Account</h3>
          <p>This action is irreversible. Proceed with caution.</p>
        </div>
        <button @click="confirmDeleteAccount" class="danger">Delete My Account</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isEditing: false,
      user: {
        fullName: "John Doe",
        email: "johndoe@example.com",
      },
      message: null,
      errors: {},
      passwordChangeMode: false,
      passwordForm: {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      },
      passwordErrors: {},
    };
  },
  methods: {
    toggleEdit() {
      this.isEditing = true;
    },
    cancelEdit() {
      this.isEditing = false;
    },
    validateField(field) {
      this.errors[field] = "";

      if (!this.user[field]) {
        this.errors[field] = `${field === "fullName" ? "Full Name" : "Email"} is required.`;
      } else if (field === "email" && !this.isValidEmail(this.user.email)) {
        this.errors.email = "Please enter a valid email address.";
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    saveProfile() {
      this.validateField("fullName");
      this.validateField("email");

      if (Object.values(this.errors).some((error) => error !== "")) {
        this.message = { text: "Please fix the errors in the form.", type: "error" };
        return;
      }

      setTimeout(() => {
        this.message = { text: "Profile saved successfully!", type: "success" };
        setTimeout(() => {
          this.message = null;
        }, 3000);
      }, 500);
    },
    requestPasswordChange() {
      this.passwordChangeMode = true;
    },
    submitNewPassword() {
      this.passwordErrors = {};

      const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm;

      if (!currentPassword) {
        this.passwordErrors.currentPassword = "Current password is required.";
      }

      if (!newPassword) {
        this.passwordErrors.newPassword = "New password is required.";
      }

      if (newPassword !== confirmNewPassword) {
        this.passwordErrors.confirmNewPassword = "Passwords do not match.";
      }

      if (Object.keys(this.passwordErrors).length > 0) {
        return;
      }

      setTimeout(() => {
        alert("Verifying current password...");
        this.message = { text: "Password changed successfully!", type: "success" };
        this.resetPasswordForm();
        setTimeout(() => {
          this.message = null;
        }, 3000);
      }, 500);
    },
    resetPasswordForm() {
      this.passwordForm = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      };
      this.passwordChangeMode = false;
    },
    cancelPasswordChange() {
      this.resetPasswordForm();
    },
    confirmDeleteAccount() {
      const confirmDelete = confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      );
      if (confirmDelete) {
        this.deleteAccount();
      }
    },
    deleteAccount() {
      setTimeout(() => {
        alert("Your account has been deleted.");
      }, 100);
    },
  },
  computed: {
    ...mapGetters(["getNotificationIcons"]),
  },
};
</script>

<style scoped lang="scss">
@import "../assets/_base.scss";
.account_container {
  width: 100%;
  height: calc(100vh - 10rem);
  @include flex(column, center, center, 2rem);

  > h2 {
    font-size: 3rem;
    color: black;
  }

  .input-wrapper {
    display: flex;
    align-items: center;
  }

  .input-wrapper input {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    cursor: not-allowed;
  }

  .input-wrapper input.editable {
    background-color: white;
    cursor: text;
    border-color: #007bff;
  }

  .edit-button {
    margin-left: 10px;
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  .save-button-container {
    margin-top: 10px;
  }

  .account-settings {
    width: 50rem;
    padding: 2rem;
    background: #dcdcdc;
    border-radius: 0.8rem;
    font-family: Arial, sans-serif;
  }

  .message {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 0.4rem;
  }
  .message.success {
    background-color: #d4edda;
    color: #155724;
  }
  .message.error {
    background-color: #f8d7da;
    color: #721c24;
  }

  .controller-container {
    @include flex(row, space-between, center, 0);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  .form-group input {
    width: 100%;
    padding: 0.8rem;
    box-sizing: border-box;
  }
  .error {
    color: red;
    font-size: 0.9em;
  }

  button {
    padding: 1rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    margin-right: 1rem;
  }
  button.secondary {
    background-color: #6c757d;
  }
  button.danger {
    background-color: #dc3545;
  }

  .divider {
    margin: 1rem 0;
  }

  .password-change-form .form-group {
    margin-bottom: 1rem;
  }
}
</style>
