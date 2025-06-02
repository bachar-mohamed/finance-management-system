<template>
  <header class="app-header">
    <!-- Company branding section -->
    <div class="company-branding">
      <span class="company-name">FinTrack</span>
    </div>

    <div class="nav-section">
      <div class="nav-button" :class="{ active: isActive('expenses') }" @click="openExpenses">
        <i class="nav-icon expense-icon"></i>
        <h2 class="nav-title">Expenses</h2>
      </div>
      <div class="nav-button" :class="{ active: isActive('income') }" @click="openIncome">
        <i class="nav-icon income-icon"></i>
        <h2 class="nav-title">Income</h2>
      </div>
    </div>
    <div class="right-side">
      <h1 class="userName">{{ getUserName }}</h1>
      <div class="user-profile" @click="switchToUser">
        <i class="user-icon"></i>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    switchToUser() {
      this.$router.push("user");
    },
    openDashBoard() {
      this.$router.push("overview");
    },
    openExpenses() {
      this.$store.commit("setActiveTag", true);
      this.$router.push("expenses");
    },
    openIncome() {
      this.$store.commit("setActiveTag", false);
      this.$router.push("income");
    },
    isActive(route) {
      return this.currentRoute === route;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/_base.scss";
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

/* Main header container */
.app-header {
  background: linear-gradient(to right, #2c3e50, #4a6572);
  width: 100%;
  height: 5rem;
  padding: 0 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  @include flex(row, space-between, center, 1rem);
  font-family: "Roboto", sans-serif;

  /* Company branding section */
  .company-branding {
    @include flex(row, flex-start, center, 0.5rem);

    .company-name {
      color: #ffffff;
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  }

  .nav-section {
    @include flex(row, space-between, center, 1rem);
    height: 3rem;
    width: 30rem;
    margin: 0 auto 0 4rem;
    padding: 0 1rem;
    border-radius: 8px;
  }

  /* Navigation button styling */
  .nav-button {
    @include flex(row, center, center, 0.75rem);
    height: 4rem;
    padding: 0 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Icon styling */
    .nav-icon {
      width: 1.5rem;
      height: 1.5rem;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    /* Dashboard icon - grid layout */
    .dashboard-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>');
    }

    /* Expense icon - money outflow */
    .expense-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>');
    }

    /* Income icon - money inflow */
    .income-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/></svg>');
    }

    /* Navigation title styling */
    .nav-title {
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }

  /* Auth links section */
  .auth-links {
    @include flex(row, center, center, 1rem);
    height: 100%;
    padding: 0 1rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* Auth button styling */
  .auth-button {
    @include flex(row, center, center, 0.75rem);
    height: 4rem;
    padding: 0 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Icon styling */
    .auth-icon {
      width: 1.5rem;
      height: 1.5rem;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    /* Sign-up icon - person with plus */
    .signup-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
    }

    /* Login icon - enter arrow */
    .login-icon {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>');
    }

    /* Auth title styling */
    .auth-title {
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }

  /* User profile styling */
  .user-profile {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    @include flex(row, center, center, 0);

    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    /* User icon */
    .user-icon {
      width: 2rem;
      height: 2rem;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}

/* Responsive styles for tablet devices */
@media (max-width: 768px) {
  .app-header {
    padding: 0 1rem;
    height: 7rem;

    .company-branding {
      .company-name {
        font-size: 1.5rem;
      }
    }

    .nav-section {
      margin: 0 auto 0 2rem;
    }

    .nav-button,
    .auth-button {
      padding: 0 1rem;

      .nav-title,
      .auth-title {
        font-size: 1rem;
      }
    }
  }
}

/* Responsive styles for mobile devices */
@media (max-width: 576px) {
  .app-header {
    height: auto;
    padding: 1rem;
    @include flex(column, center, center, 1rem);

    .company-branding {
      margin-bottom: 0.5rem;
    }

    .nav-section,
    .auth-links {
      margin: 0;
      width: 100%;
      justify-content: space-around;
    }

    .nav-button,
    .auth-button {
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem 1rem;

      .nav-title,
      .auth-title {
        font-size: 0.9rem;
      }
    }

    .user-profile {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 3rem;
      height: 3rem;
    }

    .auth-links {
      order: 1;
    }
  }
}
</style>
