import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store"; // Make sure you have a store.js file exporting your Redux store
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
// blocks wheel‑driven increments on every <input type="number">
function stopNumberScroll(e) {
  const el = document.activeElement; // the field that has focus
  if (el && el.type === "number" && e.target === el) {
    e.preventDefault(); // stop the wheel event
    el.blur(); // optional: also drop focus
  }
}

window.addEventListener("wheel", stopNumberScroll, { passive: false });

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
serviceWorkerRegistration.register();
