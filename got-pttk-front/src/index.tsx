import React from "react";
import ReactDOM from "react-dom";
import { store } from "./app/store";
import { Provider } from "react-redux";
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import Router from "./Router";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import BackgroundService from "./components/BackgroundService";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#707070",
    },
    secondary: {
      main: "#0066FF",
    },
    background: {
      paper: "#181818",
      default: "black",
    },
    warning: {
      main: "#DFFF04",
    },
  },
});

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <BackgroundService />
          <CssBaseline />
          <Router />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
