import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import { AppContainer } from "react-hot-loader";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById("root")
);
registerServiceWorker();

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./containers/App", () => {
    const NextApp = require("./containers/App").default;
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
