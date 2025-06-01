import {createRouter, createWebHistory} from "vue-router";
import authView from "@/components/AuthView";
import signUpView from "@/components/SignUpView";
import loginView from "@/components/LoginView";
import homeView from "@/components/HomeView";
import expensesView from "@/components/ExpensesView";
import userView from "@/components/UserView.vue"

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/authentication/",
            component: authView,
            children: [
                {
                    path: "sign-up",
                    component: signUpView
                },
                {
                    name: "auth",
                    path: "login",
                    component: loginView
                },
            ]
        },
        {
            path: "/home/",
            component: homeView,
            children: [
                {
                    path: "expenses",
                    component: expensesView
                }
                ,
                {
                path: "user",
                component: userView
                }
            ]
        },
        {
            path: "/",
            redirect: "/authentication/login"
        }
    ],
});
