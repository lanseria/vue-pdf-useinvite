import { createApp } from "vue";
import vuePdfVite from "../packages";
import App from "./App.vue";

const app = createApp(App);
app.use(vuePdfVite);
app.mount("#app");
