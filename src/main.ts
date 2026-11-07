import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-700.css";
import { mount } from "svelte";
import App from "./App.svelte";
import "./global.css";

export default mount(App, { target: document.body });
