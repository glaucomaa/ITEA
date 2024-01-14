import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/App.css";
import { ThemeProvider, createTheme } from "@mui/material";
// изменяем исходные цвета в MUI
const theme = createTheme({
  palette: {
    primary: {
      main: "#11182b",
    },
    secondary: {
      main: "#fefefe",
    },
    info: {
      main: "#223C82",
    },
  },
});
//рендерим компонент root
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
