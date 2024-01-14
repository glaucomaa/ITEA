import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/AllPageComponents/Layout";
import EventPage from "./pages/EventPage";
import MainPage from "./pages/MainPage";
import SignUp from "./pages/SignUp/SignUp";
import "./styles/App.css";
import { ModalProvider } from "./hoc/ModalProvider";
import Store from "./store/store";
import { createContext } from "react";
import Anketa from "./pages/Anketa/Anketa";
import { observer } from "mobx-react-lite";

interface State {
  store: Store;
}
const store = new Store();

export const Context = createContext<State>({
  store,
});
const App = () => {
  return (
    <BrowserRouter>
      <Context.Provider value={{ store }}>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<MainPage />} />
              <Route path="events/:id" element={<EventPage />} />
              {!store.isAuth && <Route path="/sign-up" element={<SignUp />} />}
              {store.isAuth && !store.user.anketaPassed && (
                <Route path="/anketa" element={<Anketa />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ModalProvider>
      </Context.Provider>
    </BrowserRouter>
  );
};

export default observer(App);
