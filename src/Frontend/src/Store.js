import { createStore } from "vuex";
import { REQUEST, AUTH_REQUEST } from "@/js/Helper";

export default createStore({
  state() {
    return {
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
        expenses: {
          serverData: [],
          expenseAllCategories: [],
          monthlySum: 0,
          highestExpense: 0,
          lineChartData: {},
          pieChartData: [],
          topMonthlyCategories: [],
          expenseCategories: [],
        },
        revenue: {
          serverData: [],
          RevenueAllCategories: [],
          monthlySum: 0,
          Revenue: 0,
          lineChartData: [],
          pieChartData: [],
          topMonthlyCategories: [],
          RevenueCategories: [],
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
    async addExpense(context, payload) {
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
        context.state.crudStatus.updateExpenseStatus = true;
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
        context.state.crudStatus.deleteExpenseStatus = true;
      } catch (error) {
        console.log(error);
      }
      context.state.crudStatus.isLoading = false;
    },
  },
  getters: {
    getUserId(state) {
      return state.user.id;
    },
    getUserToken(state) {
      return state.authRequest.token;
    },
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
    getRevenueCategories(state) {
      return state.user.revenue.RevenueAllCategories;
    },
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
  },
});
