import { createStore } from "vuex";
import { REQUEST, AUTH_REQUEST } from "@/js/Helper";

export default createStore({
  state() {
    return {
      notificationIcons: [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#63E6BE" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#f57a7a" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
      ],
      authRequest: {
        status: -1,
        message: "",
        token: "",
      },
      crudStatus: {
        isLoading: false,
        addExpenseStatus: false,
        updateExpenseStatus: false,
        deleteExpenseStatus: false,
        updateRevenueStatus: false,
        deleteRevenueStatus: false,
      },
      user: {
        id: 1,
        userName: "",
        email: "",
        expenses: {
          serverData: [],
          expenseAllCategories: [],
          monthlySum: 0,
          highestExpense: 0,
          lineChartData: {},
          pieChartData: [],
          topMonthlyCategories: [],
        },
        revenue: {
          serverData: [],
          RevenueAllCategories: [],
          monthlySum: 0,
          Revenue: 0,
          lineChartData: [],
          pieChartData: [],
          topMonthlyCategories: [],
        },
      },
    };
  },
  mutations: {
    login(state, payload) {
      state.authRequest.message = payload.message;
      state.authRequest.token = payload.token;
      state.user.id = payload.id;
    },
    register(state, payload) {
      state.user.id = payload.id;
    },
    setUserInfo(state, payload) {
      state.user.userName = payload.fullName;
      state.user.email = payload.email;
    },
    setDeleteAccountStatus(state, payload) {
      state.crudStatus.deleteExpenseStatus = payload;
    },
    setUpdateStatus(state, payload) {
      state.crudStatus.updateExpenseStatus = payload;
    },
    //income
    setRevenues(state, payload) {
      state.user.revenue.serverData = payload.map((transaction) => {
        const transactionDate = new Date(transaction["transactionDate"]);
        const updateDate = new Date(transaction["updatedAt"]);
        const transactionDay = String(transactionDate.getDate()).padStart(2, "0");
        const transactionMonth = String(transactionDate.getMonth() + 1).padStart(2, "0");
        const transactionYear = transactionDate.getFullYear();
        const formattedTransactionDate = `${transactionDay}-${transactionMonth}-${transactionYear}`;
        const updateDay = String(updateDate.getDate()).padStart(2, "0");
        const updateMonth = String(updateDate.getMonth() + 1).padStart(2, "0");
        const updateYear = updateDate.getFullYear();
        const formattedUpdateDate = `${updateDay}-${updateMonth}-${updateYear}`;

        transaction["transactionDate"] = formattedTransactionDate;
        transaction["updatedAt"] = formattedUpdateDate;
        return transaction;
      });

      console.log(state.user.revenue.serverData);
    },
    setMonthlyRevenueSum(state) {
      const total = state.user.revenue.serverData.reduce((acc, expense) => {
        return acc + parseFloat(expense.amount);
      }, 0);

      state.user.revenue.monthlySum = parseFloat(total.toFixed(2));

      console.log(state.user.revenue.monthlySum);
    },
    setHighestMonthlyRevenue(state) {
      state.user.revenue.highestExpense = 0;
      state.user.revenue.lineChartData.amounts.forEach((amount) => {
        console.log(`${state.user.revenue.highestExpense},${amount}`);
        state.user.revenue.highestExpense = Math.max(state.user.revenue.highestExpense, amount);
      });
      console.log(state.user.revenue.highestExpense);
    },
    setTopRevenueCategories(state) {
      const categoryTotals = {};
      state.user.revenue.serverData.forEach((transaction) => {
        const { categoryName, amount, categoryImage } = transaction;
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = {
            categoryName,
            totalAmount: 0,
            categoryImage,
          };
        }
        categoryTotals[categoryName].totalAmount += amount;
      });
      const sortedCategories = Object.values(categoryTotals).sort(
        (a, b) => b.totalAmount - a.totalAmount
      );
      state.user.revenue.topMonthlyCategories = sortedCategories;
      console.log(state.user.revenue.topMonthlyCategories);
      state.user.revenue.pieChartData = sortedCategories.map((item) => ({
        value: item.totalAmount,
        name: item.categoryName,
      }));
      console.log("pie");
      console.log(state.user.revenue.pieChartData);
    },
    setRevenueLineChartData(state) {
      const dailyTotals = {};

      state.user.revenue.serverData.forEach((expense) => {
        const dateString = expense.transactionDate;
        const [day, month, year] = dateString.split("-");
        const date = new Date(year, month - 1, day);
        const dayStr = String(date.getDate()).padStart(2, "0");
        if (!dailyTotals[dayStr]) {
          dailyTotals[dayStr] = 0;
        }
        dailyTotals[dayStr] += parseFloat(expense.amount);
      });
      const sortedDays = Object.keys(dailyTotals).sort();
      const amounts = sortedDays.map((day) => Math.round(dailyTotals[day] * 100) / 100);
      const days = sortedDays;
      state.user.revenue.lineChartData = { amounts, days };
      console.log(state.user.revenue.lineChartData);
    },
    addNewRevenue(state, data) {
      const transactionDate = new Date(data["transactionDate"]);
      const updateDate = new Date(data["updatedAt"]);
      const transactionDay = String(transactionDate.getDate()).padStart(2, "0");
      const transactionMonth = String(transactionDate.getMonth() + 1).padStart(2, "0");
      const transactionYear = transactionDate.getFullYear();
      const formattedTransactionDate = `${transactionDay}-${transactionMonth}-${transactionYear}`;
      const updateDay = String(updateDate.getDate()).padStart(2, "0");
      const updateMonth = String(updateDate.getMonth() + 1).padStart(2, "0");
      const updateYear = updateDate.getFullYear();
      const formattedUpdateDate = `${updateDay}-${updateMonth}-${updateYear}`;
      data["transactionDate"] = formattedTransactionDate;
      data["updatedAt"] = formattedUpdateDate;
      state.user.revenue.serverData.unshift(data);
    },
    updateRevenue(state, data) {
      console.log(data);
      let revenue = state.user.revenue.serverData.find((exp) => {
        return exp.id == data.itemId;
      });
      revenue["description"] = data.description;
      revenue["amount"] = data.amount;
      revenue["categoryName"] = data.category;
      revenue["categoryImage"] = state.user.revenue.RevenueAllCategories.find((exp) => {
        return exp.categoryName == data.category;
      }).categoryImage;
    },
    deleteRevenue(state, data) {
      state.user.revenue.serverData = state.user.revenue.serverData.filter((exp) => {
        return exp.id != data.itemId;
      });
    },
    //expense
    setExpenses(state, payload) {
      state.user.expenses.serverData = payload.map((transaction) => {
        const transactionDate = new Date(transaction["transactionDate"]);
        const updateDate = new Date(transaction["updatedAt"]);
        const transactionDay = String(transactionDate.getDate()).padStart(2, "0");
        const transactionMonth = String(transactionDate.getMonth() + 1).padStart(2, "0");
        const transactionYear = transactionDate.getFullYear();
        const formattedTransactionDate = `${transactionDay}-${transactionMonth}-${transactionYear}`;
        const updateDay = String(updateDate.getDate()).padStart(2, "0");
        const updateMonth = String(updateDate.getMonth() + 1).padStart(2, "0");
        const updateYear = updateDate.getFullYear();
        const formattedUpdateDate = `${updateDay}-${updateMonth}-${updateYear}`;

        transaction["transactionDate"] = formattedTransactionDate;
        transaction["updatedAt"] = formattedUpdateDate;
        return transaction;
      });

      console.log(state.user.expenses.serverData);
    },
    setMonthlyExpenseSum(state) {
      const total = state.user.expenses.serverData.reduce((acc, expense) => {
        return acc + parseFloat(expense.amount);
      }, 0);

      state.user.expenses.monthlySum = parseFloat(total.toFixed(2));

      console.log(state.user.expenses.monthlySum);
    },
    setHighestMonthlyExpense(state) {
      state.user.expenses.highestExpense = 0;
      state.user.expenses.lineChartData.amounts.forEach((amount) => {
        console.log(`${state.user.expenses.highestExpense},${amount}`);
        state.user.expenses.highestExpense = Math.max(state.user.expenses.highestExpense, amount);
      });
      console.log(state.user.expenses.highestExpense);
    },
    setTopExpenseCategories(state) {
      const categoryTotals = {};
      state.user.expenses.serverData.forEach((transaction) => {
        const { categoryName, amount, categoryImage } = transaction;
        if (!categoryTotals[categoryName]) {
          categoryTotals[categoryName] = {
            categoryName,
            totalAmount: 0,
            categoryImage,
          };
        }
        categoryTotals[categoryName].totalAmount += amount;
      });
      const sortedCategories = Object.values(categoryTotals).sort(
        (a, b) => b.totalAmount - a.totalAmount
      );
      state.user.expenses.topMonthlyCategories = sortedCategories;
      console.log(state.user.expenses.topMonthlyCategories);
      state.user.expenses.pieChartData = sortedCategories.map((item) => ({
        value: item.totalAmount,
        name: item.categoryName,
      }));
      console.log("pie");
      console.log(state.user.expenses.pieChartData);
    },
    setExpenseLineChartData(state) {
      const dailyTotals = {};

      state.user.expenses.serverData.forEach((expense) => {
        const dateString = expense.transactionDate;
        const [day, month, year] = dateString.split("-");
        const date = new Date(year, month - 1, day);
        const dayStr = String(date.getDate()).padStart(2, "0");
        if (!dailyTotals[dayStr]) {
          dailyTotals[dayStr] = 0;
        }
        dailyTotals[dayStr] += parseFloat(expense.amount);
      });
      const sortedDays = Object.keys(dailyTotals).sort();
      const amounts = sortedDays.map((day) => Math.round(dailyTotals[day] * 100) / 100);
      const days = sortedDays;
      state.user.expenses.lineChartData = { amounts, days };
      console.log(state.user.expenses.lineChartData);
    },
    addNewExpense(state, data) {
      const transactionDate = new Date(data["transactionDate"]);
      const updateDate = new Date(data["updatedAt"]);
      const transactionDay = String(transactionDate.getDate()).padStart(2, "0");
      const transactionMonth = String(transactionDate.getMonth() + 1).padStart(2, "0");
      const transactionYear = transactionDate.getFullYear();
      const formattedTransactionDate = `${transactionDay}-${transactionMonth}-${transactionYear}`;
      const updateDay = String(updateDate.getDate()).padStart(2, "0");
      const updateMonth = String(updateDate.getMonth() + 1).padStart(2, "0");
      const updateYear = updateDate.getFullYear();
      const formattedUpdateDate = `${updateDay}-${updateMonth}-${updateYear}`;
      data["transactionDate"] = formattedTransactionDate;
      data["updatedAt"] = formattedUpdateDate;
      state.user.expenses.serverData.unshift(data);
    },
    updateExpense(state, data) {
      console.log(data);
      let expense = state.user.expenses.serverData.find((exp) => {
        return exp.id == data.itemId;
      });
      console.log("before");
      console.log(expense);
      expense["description"] = data.description;
      expense["amount"] = data.amount;
      expense["categoryName"] = data.category;
      expense["categoryImage"] = state.user.expenses.expenseAllCategories.find((exp) => {
        return exp.categoryName == data.category;
      }).categoryImage;
      console.log("after");
      console.log(expense);
    },
    deleteExpense(state, data) {
      state.user.expenses.serverData = state.user.expenses.serverData.filter((exp) => {
        return exp.id != data.itemId;
      });
    },
    //categories
    setCategories(state, data) {
      state.user.expenses.expenseAllCategories = data.filter((category) => {
        return category.type == "expense";
      });
      state.user.revenue.RevenueAllCategories = data.filter((category) => {
        return category.type == "income";
      });
    },
  },
  actions: {
    async authenticateUser(context, payload) {
      const url = `http://localhost:1234/api/auth/authenticate`;
      const body = {
        email: payload.email,
        password: payload.password,
      };
      try {
        const response = await AUTH_REQUEST("POST", url, body);
        const data = await response.json();
        console.log(data);
        context.commit("login", data);
      } catch (error) {
        console.log(error);
      }
    },
    async registerUser(context, payload) {
      console.log(payload);
      const url = "http://localhost:1234/api/auth/register";
      try {
        const response = await AUTH_REQUEST("POST", url, payload);
        const data = await response.json();
        console.log(data);
        context.commit("register", data);
      } catch (error) {
        console.log(error);
      }
    },
    async loadUserInformation(context) {
      const url = `http://localhost:1234/api/user/get-info?userId=${context.state.user.id}`;
      try {
        const response = await REQUEST("GET", context.state.authRequest.token, url);
        const data = response;
        context.commit("setUserInfo", data);
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserInformation(context, payload) {
      context.state.crudStatus.updateExpenseStatus = false;
      const url = "http://localhost:1234/api/user/update-info";
      const body = {
        userId: context.state.user.id,
        userName: payload.userName,
        email: payload.email,
      };
      try {
        const response = await REQUEST("PUT", context.state.authRequest.token, url, body);
        const data = response;
        context.commit("setUpdateStatus", data);
        context.state.crudStatus.updateExpenseStatus = true;
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserPassword(context, payload) {
      context.state.crudStatus.updateExpenseStatus = false;
      const url = "http://localhost:1234/api/user/update-password";
      const body = {
        userId: context.state.user.id,
        oldPassword: payload.currentPassword,
        newPassword: payload.newPassword,
      };
      try {
        const response = await REQUEST("PUT", context.state.authRequest.token, url, body);
        const data = response;
        context.commit("setUpdateStatus", data);
      } catch (error) {
        console.log(error);
      }
    },
    async deleteUserAccount(context) {
      context.state.crudStatus.deleteExpenseStatus = false;
      const url = `http://localhost:1234/api/user/delete-user`;
      const body = {
        userId: context.state.user.id,
      };
      try {
        const response = await REQUEST("DELETE", context.state.authRequest.token, url, body);
        const data = response;
        context.commit("setDeleteAccountStatus", data);
      } catch (error) {
        console.log(error);
      }
    },
    //incomes
    async loadRevenueList(context, payload) {
      console.log(payload);
      const url = `http://localhost:1234/api/incomes/monthly-income?userId=${context.state.user.id}&year=${payload.year}&month=${payload.month}`;
      try {
        const response = await REQUEST("GET", context.state.authRequest.token, url);
        const data = response;
        context.commit("setRevenues", data);
        context.commit("setMonthlyRevenueSum");
        context.commit("setTopRevenueCategories");
        context.commit("setRevenueLineChartData");
        context.commit("setHighestMonthlyRevenue");
      } catch (error) {
        console.log(error);
      }
    },
    async addRevenue(context, payload) {
      if (payload.date == undefined) return;
      context.state.crudStatus.isLoading = true;
      context.state.crudStatus.addExpenseStatus = false;
      context.state.crudStatus.updateExpenseStatus = false;
      context.state.crudStatus.deleteExpenseStatus = false;
      const url = `http://localhost:1234/api/incomes/add-income`;
      console.log(`payload date is ${payload.date}`);
      const body = {
        userId: context.state.user.id,
        amount: payload.amount,
        description: payload.description,
        category: payload.category,
        transactionDate: (([y, m, d]) => `${m}/${d}/${y}`)(payload.date.split("-")),
      };
      console.log(body);
      try {
        const response = await REQUEST("POST", context.state.authRequest.token, url, body);
        const data = response;
        console.log(data);
        if (data != null) {
          context.commit("addNewRevenue", data);
          context.state.crudStatus.addExpenseStatus = true;
        }
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
    async updateRevenue(context, payload) {
      if (payload.description == undefined) return;
      console.log("updating");
      context.state.crudStatus.isLoading = true;
      context.state.crudStatus.updateExpenseStatus = false;
      context.state.crudStatus.addExpenseStatus = false;
      context.state.crudStatus.deleteExpenseStatus = false;
      console.log(payload);
      const url = `http://localhost:1234/api/incomes/update-income`;
      const body = {
        userId: context.state.user.id,
        incomeId: payload.itemId,
        description: payload.description,
        category: payload.category,
        amount: payload.amount,
      };
      console.log(body);
      try {
        const response = await REQUEST("PUT", context.state.authRequest.token, url, body);
        const data = response;
        console.log(data);
        if (data) {
          context.commit("updateRevenue", payload);
          context.state.crudStatus.updateExpenseStatus = true;
        }
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
    async deleteRevenue(context, payload) {
      context.state.crudStatus.isLoading = true;
      context.state.crudStatus.deleteExpenseStatus = false;
      context.state.crudStatus.updateExpenseStatus = false;
      context.state.crudStatus.addExpenseStatus = false;
      console.log(payload);
      const url = `http://localhost:1234/api/incomes/delete-income`;
      const body = {
        userId: context.state.user.id,
        incomeId: payload.itemId,
      };
      console.log(body);
      try {
        const response = await REQUEST("DELETE", context.state.authRequest.token, url, body);
        const data = response;
        console.log(data);
        if (data) {
          context.commit("deleteRevenue", payload);
          context.state.crudStatus.deleteExpenseStatus = true;
        }
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
    //expenses
    async loadExpenses(context, payload) {
      console.log(payload);
      const url = `http://localhost:1234/api/expenses/monthly-expenses?userId=${context.state.user.id}&year=${payload.year}&month=${payload.month}`;
      console.log(url);
      try {
        const response = await REQUEST("GET", context.state.authRequest.token, url);
        const data = response;
        console.log(data);
        context.commit("setExpenses", data);
        context.commit("setMonthlyExpenseSum");
        context.commit("setTopExpenseCategories");
        context.commit("setExpenseLineChartData");
        context.commit("setHighestMonthlyExpense");
      } catch (error) {
        console.log(error);
      }
    },
    async addExpense(context, payload) {
      console.log("adding");
      if (payload.date == undefined) return;
      context.state.crudStatus.isLoading = true;
      context.state.crudStatus.addExpenseStatus = false;
      context.state.crudStatus.updateExpenseStatus = false;
      context.state.crudStatus.deleteExpenseStatus = false;
      const url = `http://localhost:1234/api/expenses/add-expense`;
      console.log(`payload date is ${payload.date}`);
      const body = {
        userId: context.state.user.id,
        amount: payload.amount,
        description: payload.description,
        category: payload.category,
        transactionDate: (([y, m, d]) => `${m}/${d}/${y}`)(payload.date.split("-")),
      };
      console.log(body);
      try {
        const response = await REQUEST("POST", context.state.authRequest.token, url, body);
        const data = response;
        console.log(data);
        if (data != null) {
          context.commit("addNewExpense", data);
          context.state.crudStatus.addExpenseStatus = true;
        }
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
    async updateExpense(context, payload) {
      if (payload.description == undefined) return;
      console.log("updating");
      context.state.crudStatus.isLoading = true;
      context.state.crudStatus.updateExpenseStatus = false;
      context.state.crudStatus.addExpenseStatus = false;
      context.state.crudStatus.deleteExpenseStatus = false;
      console.log(payload);
      const url = `http://localhost:1234/api/expenses/update-expense`;
      const body = {
        userId: context.state.user.id,
        expenseId: payload.itemId,
        description: payload.description,
        category: payload.category,
        amount: payload.amount,
      };
      console.log(body);
      try {
        const response = await REQUEST("PUT", context.state.authRequest.token, url, body);
        const data = response;
        console.log(data);
        if (data) {
          context.commit("updateExpense", payload);
          context.state.crudStatus.updateExpenseStatus = true;
        }
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
    async deleteExpense(context, payload) {
      context.state.crudStatus.isLoading = true;
      context.state.crudStatus.deleteExpenseStatus = false;
      context.state.crudStatus.updateExpenseStatus = false;
      context.state.crudStatus.addExpenseStatus = false;
      console.log(payload);
      const url = `http://localhost:1234/api/expenses/delete-expense`;
      const body = {
        userId: context.state.user.id,
        expenseId: payload.itemId,
      };
      console.log(body);
      try {
        const response = await REQUEST("DELETE", context.state.authRequest.token, url, body);
        const data = response;
        console.log(data);
        if (data) {
          context.commit("deleteExpense", payload);
          context.state.crudStatus.deleteExpenseStatus = true;
        }
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
    //categories
    async loadCategories(context) {
      const url = `http://localhost:1234/api/categories/get-categories`;
      try {
        const response = await REQUEST("GET", context.state.authRequest.token, url);
        const data = response;
        console.log(data);
        context.commit("setCategories", data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    getUserId(state) {
      return state.user.id;
    },
    getUserToken(state) {
      return state.authRequest.token;
    },
    //expenses
    getMonthlyExpenses(state) {
      return state.user.expenses.serverData;
    },
    getTotalExpense(state) {
      return state.user.expenses.monthlySum;
    },
    getHighestExpense(state) {
      return state.user.expenses.highestExpense;
    },
    getTopExpenseCategories(state) {
      return state.user.expenses.topMonthlyCategories;
    },
    getExpenseLineChartData(state) {
      return state.user.expenses.lineChartData;
    },
    getPieChartData(state) {
      return state.user.expenses.pieChartData;
    },
    getExpenseCategories(state) {
      return state.user.expenses.expenseAllCategories;
    },
    //income
    getMonthlyIncome(state) {
      return state.user.revenue.serverData;
    },
    getTotalIncome(state) {
      return state.user.revenue.monthlySum;
    },
    getHighestIncome(state) {
      return state.user.revenue.highestExpense;
    },
    getTopIncomeCategories(state) {
      return state.user.revenue.topMonthlyCategories;
    },
    getIncomeLineChartData(state) {
      return state.user.revenue.lineChartData;
    },
    getIncomePieChartData(state) {
      return state.user.revenue.pieChartData;
    },
    getIncomeCategories(state) {
      return state.user.revenue.RevenueAllCategories;
    },
    //status
    getAddExpenseStatus(state) {
      return state.crudStatus.addExpenseStatus;
    },
    getUpdateExpenseStatus(state) {
      return state.crudStatus.updateExpenseStatus;
    },
    getDeleteExpenseStatus(state) {
      return state.crudStatus.deleteExpenseStatus;
    },
    getIsLoading(state) {
      return state.crudStatus.isLoading;
    },
    //others
    getNotificationIcons(state) {
      return state.notificationIcons;
    },
    getUserEmail(state) {
      return state.user.email;
    },
    getUserName(state) {
      return state.user.userName;
    },
  },
});
