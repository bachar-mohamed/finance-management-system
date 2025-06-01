import { createApp } from "vue";
import Router from "./Router";
import App from "./App.vue";
import store from "@/Store";
import NotificationView from "@/components/NotificationView";
import VueGoogleCharts from "vue-google-charts";

const app = createApp(App);
app.component("notification-view", NotificationView);
app.use(Router);
app.use(store);
app.use(VueGoogleCharts);
app.mount("#app");

Router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.getUserToken !== "";
  console.log("Navigating from:", from.path, "to:", to.path);
  if (to.path.startsWith("/home") && !isAuthenticated) {
    next({ name: "auth" });
  } else if (
    from.path.startsWith("/authentication") &&
    !to.path.startsWith("/authentication") &&
    !isAuthenticated
  ) {
    next({ name: "auth" });
  } else {
    next();
  }
});
