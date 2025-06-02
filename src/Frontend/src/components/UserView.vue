<template>
  <section class="account_container">
    <h2>User Account Settings</h2>
    <div class="account-settings">
      <div class="form-group">
        <label>Full Name:</label>
        <div class="input-wrapper">
          <input
            type="text"
            v-model="user.userName"
            @blur="validateField('userName')"
            :readonly="!isEditingName"
            :class="{ editable: isEditingName }"
          />
          <div v-html="editSvg" class="edit-button" @click="toggleEditName"></div>
        </div>
        <span v-if="errors.userName" class="error">{{ errors.userName }}</span>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <div class="input-wrapper">
          <input
            type="email"
            v-model="user.email"
            @blur="validateField('email')"
            :readonly="!isEditingEmail"
            :class="{ editable: isEditingEmail }"
          />
          <div
            v-if="!isEditing"
            v-html="editSvg"
            class="edit-button"
            @click="toggleEditEmail"
          ></div>
        </div>
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>
      <button
        @click="saveProfile"
        :class="{
          disabled:
            originalInformation.userName == user.userName &&
            originalInformation.email == user.email,
        }"
      >
        Save Profile
      </button>

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
      editSvg: `<svg width="20px" height="20px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.2942 7.95881C13.5533 7.63559 13.5013 7.16358 13.178 6.90453C12.8548 6.64549 12.3828 6.6975 12.1238 7.02072L13.2942 7.95881ZM6.811 14.8488L7.37903 15.3385C7.38489 15.3317 7.39062 15.3248 7.39623 15.3178L6.811 14.8488ZM6.64 15.2668L5.89146 15.2179L5.8908 15.2321L6.64 15.2668ZM6.5 18.2898L5.7508 18.2551C5.74908 18.2923 5.75013 18.3296 5.75396 18.3667L6.5 18.2898ZM7.287 18.9768L7.31152 19.7264C7.36154 19.7247 7.41126 19.7181 7.45996 19.7065L7.287 18.9768ZM10.287 18.2658L10.46 18.9956L10.4716 18.9927L10.287 18.2658ZM10.672 18.0218L11.2506 18.4991L11.2571 18.491L10.672 18.0218ZM17.2971 10.959C17.5562 10.6358 17.5043 10.1638 17.1812 9.90466C16.8581 9.64552 16.386 9.69742 16.1269 10.0206L17.2971 10.959ZM12.1269 7.02052C11.8678 7.34365 11.9196 7.81568 12.2428 8.07484C12.5659 8.33399 13.0379 8.28213 13.2971 7.95901L12.1269 7.02052ZM14.3 5.50976L14.8851 5.97901C14.8949 5.96672 14.9044 5.95412 14.9135 5.94123L14.3 5.50976ZM15.929 5.18976L16.4088 4.61332C16.3849 4.59344 16.3598 4.57507 16.3337 4.5583L15.929 5.18976ZM18.166 7.05176L18.6968 6.52192C18.6805 6.50561 18.6635 6.49007 18.6458 6.47532L18.166 7.05176ZM18.5029 7.87264L19.2529 7.87676V7.87676L18.5029 7.87264ZM18.157 8.68976L17.632 8.15412C17.6108 8.17496 17.5908 8.19704 17.5721 8.22025L18.157 8.68976ZM16.1271 10.0203C15.8678 10.3433 15.9195 10.8153 16.2425 11.0746C16.5655 11.3339 17.0376 11.2823 17.2969 10.9593L16.1271 10.0203ZM13.4537 7.37862C13.3923 6.96898 13.0105 6.68666 12.6009 6.74805C12.1912 6.80943 11.9089 7.19127 11.9703 7.60091L13.4537 7.37862ZM16.813 11.2329C17.2234 11.1772 17.5109 10.7992 17.4552 10.3888C17.3994 9.97834 17.0215 9.69082 16.611 9.74659L16.813 11.2329ZM12.1238 7.02072L6.22577 14.3797L7.39623 15.3178L13.2942 7.95881L12.1238 7.02072ZM6.24297 14.359C6.03561 14.5995 5.91226 14.9011 5.89159 15.218L7.38841 15.3156C7.38786 15.324 7.38457 15.3321 7.37903 15.3385L6.24297 14.359ZM5.8908 15.2321L5.7508 18.2551L7.2492 18.3245L7.3892 15.3015L5.8908 15.2321ZM5.75396 18.3667C5.83563 19.1586 6.51588 19.7524 7.31152 19.7264L7.26248 18.2272C7.25928 18.2273 7.25771 18.2268 7.25669 18.2264C7.25526 18.2259 7.25337 18.2249 7.25144 18.2232C7.2495 18.2215 7.24825 18.2198 7.24754 18.2185C7.24703 18.2175 7.24637 18.216 7.24604 18.2128L5.75396 18.3667ZM7.45996 19.7065L10.46 18.9955L10.114 17.536L7.11404 18.247L7.45996 19.7065ZM10.4716 18.9927C10.7771 18.9151 11.05 18.7422 11.2506 18.499L10.0934 17.5445C10.0958 17.5417 10.0989 17.5397 10.1024 17.5388L10.4716 18.9927ZM11.2571 18.491L17.2971 10.959L16.1269 10.0206L10.0869 17.5526L11.2571 18.491ZM13.2971 7.95901L14.8851 5.97901L13.7149 5.04052L12.1269 7.02052L13.2971 7.95901ZM14.9135 5.94123C15.0521 5.74411 15.3214 5.6912 15.5243 5.82123L16.3337 4.5583C15.4544 3.99484 14.2873 4.2241 13.6865 5.0783L14.9135 5.94123ZM15.4492 5.7662L17.6862 7.6282L18.6458 6.47532L16.4088 4.61332L15.4492 5.7662ZM17.6352 7.58161C17.7111 7.6577 17.7535 7.761 17.7529 7.86852L19.2529 7.87676C19.2557 7.36905 19.0555 6.88127 18.6968 6.52192L17.6352 7.58161ZM17.7529 7.86852C17.7524 7.97604 17.7088 8.07886 17.632 8.15412L18.682 9.22541C19.0446 8.87002 19.2501 8.38447 19.2529 7.87676L17.7529 7.86852ZM17.5721 8.22025L16.1271 10.0203L17.2969 10.9593L18.7419 9.15928L17.5721 8.22025ZM11.9703 7.60091C12.3196 9.93221 14.4771 11.5503 16.813 11.2329L16.611 9.74659C15.0881 9.95352 13.6815 8.89855 13.4537 7.37862L11.9703 7.60091Z" fill="#000000"/>
                </svg>`,
      user: {
        userName: "",
        email: "",
      },
      originalInformation: {
        userName: "",
        email: "",
      },
      isEditingName: false,
      isEditingEmail: false,
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
    toggleEditName() {
      this.isEditingName = !this.isEditingName;
    },
    toggleEditEmail() {
      this.isEditingEmail = !this.isEditingEmail;
    },
    validateField(field) {
      this.errors[field] = "";

      if (!this.user[field]) {
        this.errors[field] = `${field === "userName" ? "User Name" : "Email"} is required.`;
      } else if (field === "email" && !this.isValidEmail(this.user.email)) {
        this.errors.email = "Please enter a valid email address.";
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    saveProfile() {
      console.log(this.originalInformation);
      this.validateField("userName");
      this.validateField("email");

      if (Object.values(this.errors).some((error) => error !== "")) {
        this.message = { text: "Please fix the errors in the form.", type: "error" };
        return;
      }
      this.$store.dispatch("updateUserInformation", this.user);
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
      this.$store.dispatch("updateUserPassword", this.passwordForm);
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
      this.$store.dispatch("deleteUserAccount");
    },
  },
  computed: {
    ...mapGetters(["getNotificationIcons", "getUserEmail", "getUserName"]),
  },
  mounted() {
    this.user.userName = this.getUserName;
    this.user.email = this.getUserEmail;
    this.originalInformation.userName = this.getUserName;
    this.originalInformation.email = this.getUserEmail;
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
    border: 1px solid #ccc;
    background-color: #ccc;
    border-radius: 6px;
    padding: 0;
    overflow: hidden;
  }

  .input-wrapper input {
    flex: 1;
    padding: 8px;
    width: 95%;
    background-color: transparent;
    border: none;

    &:focus {
      outline: transparent;
    }
  }

  .input-wrapper input.editable {
    background-color: white;
    cursor: text;

    &:focus {
      outline: black;
    }
  }

  .edit-button {
    @include flex(row, center, center, 0rem);
    background-color: transparent;
    width: 6%;
    border-radius: 2px;
    margin: 0;
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
    border-radius: 6px;
    border-color: transparent;
    box-shadow: 0px 0px 2px -1px black;
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

  button.disabled {
    background-color: grey;
    cursor: not-allowed;
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
