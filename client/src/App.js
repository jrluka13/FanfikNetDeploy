import React, { useCallback, useState } from "react";
import { useRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { SwitchCheckedContext } from "./context/SwitchCheckedContext";
import { Navbar } from "./components/navbar/Navbar";
import { Loader } from "./components/loader/Loader";
import { IntlProvider } from "react-intl";
import locales from "./locales/locales";
import ru from "./locales/ru.json";
import en from "./locales/en.json";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch/dom";

const messages = {
  [locales.RU]: ru,
  [locales.EN]: en,
};

const searchClient = algoliasearch(
  "LO7QGN0AHP",
  "e909282272c391f812b5214f9fb49197"
);

function App() {
  const [currentLocale, setCurrentLocale] = useState(
    localStorage.getItem("locale") || locales.EN
  );
  const [checked, setChecked] = useState(null);
  const [user, setUser] = useState();
  const [users, setUsers] = useState();

  const [isAdmin, setAdmin] = useState();
  const updateLocale = useCallback(
    (value) => {
      setCurrentLocale(value);
      localStorage.setItem("locale", value);
    },
    [setCurrentLocale]
  );
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  const updateData = (value) => {
    setChecked(value);
  };
  const findUser = (value) => {
    setUser(value);
  };
  const findUsers = (value) => {
    setUsers(value);
  };
  const isLogin = (value) => {
    setAdmin(value);
  };
  // const Hit = ({ hit }) => <p>{hit.name}</p>;

  if (!ready) {
    return <Loader />;
  }
  return (
    <div id="wrapper">
      <IntlProvider locale={currentLocale} messages={messages[currentLocale]}>
        <AuthContext.Provider
          value={{
            token,
            login,
            logout,
            userId,
            isAuthenticated,
          }}
        >
          <SwitchCheckedContext.Provider value={{ checked, user, users }}>
            <BrowserRouter>
              <InstantSearch
                indexName="demo_ecommerce"
                searchClient={searchClient}
              >
                <Navbar
                  value={currentLocale}
                  onChange={updateLocale}
                  updateData={updateData}
                  findUser={findUser}
                  findUsers={findUsers}
                  isLogin={isLogin}
                  userAdmin={isAdmin}
                />

                <div className="container pt-5 d-flex justify-content-center">
                  {routes}
                </div>
              </InstantSearch>
            </BrowserRouter>
          </SwitchCheckedContext.Provider>
        </AuthContext.Provider>
      </IntlProvider>
    </div>
  );
}

export default App;
