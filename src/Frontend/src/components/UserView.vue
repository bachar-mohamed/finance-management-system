<template>
  <div class="account-settings">
    <h2>User Account Settings</h2>

    <div v-if="message" :class="['message', message.type]">{{ message.text }}</div>

    <div class="form-group">
      <label>Full Name:</label>
      <input type="text" v-model="user.fullName" @blur="validateField('fullName')" />
      <span v-if="errors.fullName" class="error">{{ errors.fullName }}</span>
    </div>

    <div class="form-group">
      <label>Email:</label>
      <input type="email" v-model="user.email" @blur="validateField('email')" />
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>

    <button @click="saveProfile">Save Profile</button>

    <hr class="divider" />

    <h3>Change Password</h3>

    <div v-if="!passwordChangeMode">
      <button @click="requestPasswordChange">Change Password</button>
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

    <h3>Delete Account</h3>
    <p>This action is irreversible. Proceed with caution.</p>
    <button @click="confirmDeleteAccount" class="danger">Delete My Account</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Simulated user object
      user: {
        fullName: "John Doe",
        email: "johndoe@example.com",
      },

      // Message handling
      message: null,

      // Validation errors
      errors: {},

      // Password change fields
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

      // Simulate saving to backend
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

      // Simulate API call
      setTimeout(() => {
        alert("Verifying current password..."); // In real app, send to server
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
      // Simulate account deletion
      setTimeout(() => {
        alert("Your account has been deleted.");
        // Redirect or logout logic here
      }, 100);
    },
  },
};
</script>

<style scoped>
.account-settings {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.message {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
}
.message.success {
  background-color: #d4edda;
  color: #155724;
}
.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.error {
  color: red;
  font-size: 0.9em;
}

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}
button.secondary {
  background-color: #6c757d;
}
button.danger {
  background-color: #dc3545;
}

.divider {
  margin: 30px 0;
}

.password-change-form .form-group {
  margin-bottom: 10px;
}
</style>
