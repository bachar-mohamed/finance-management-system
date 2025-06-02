import { createRouter, createWebHistory } from "vue-router";
import authView from "@/components/AuthView";
import signUpView from "@/components/SignUpView";
import loginView from "@/components/LoginView";
import homeView from "@/components/HomeView";
import expensesView from "@/components/ExpensesView";
import userView from "@/components/UserView.vue";
import IncomeView from "./components/IncomeView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/authentication/",
      component: authView,
      children: [
        {
          name: "signUp",
          path: "sign-up",
          component: signUpView,
        },
        {
          name: "login",
          path: "login",
          component: loginView,
        },
      ],
    },
    {
      path: "/home/",
      component: homeView,
      children: [
        {
          name: "expenses",
          path: "expenses",
          component: expensesView,
        },
        {
          name: "income",
          path: "income",
          component: IncomeView,
        },
        {
          name: "user",
          path: "user",
          component: userView,
        },
      ],
    },
    {
      path: "/",
      redirect: "/authentication/login",
    },
  ],
});
