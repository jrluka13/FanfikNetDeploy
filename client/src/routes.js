import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { Main } from "./pages/Main/Main";
import CreateBook from "./pages/CreateBook/CreateBook";
import { Private } from "./pages/Private/Private";
import BookPage from "./pages/BookPage/BookPage";
import Chapter from "./pages/Chapter/Chapter";
import EditBook from "./pages/EditBook/EditBook";
import AdminPage from "./pages/AdminPage/AdminPage";
import { UserPrivate } from "./pages/UserPrivate/UserPrivate";

export const useRoutes = (isAuthenticated) => {
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/main" exact>
          <Main />
        </Route>
        <Route path="/bookpage/:id" exact>
        <BookPage />
      </Route>
      <Route path="/:id/">
        <Chapter />
      </Route>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Redirect to="/main" />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/main" exact>
        <Main />
      </Route>

      <Route path="/:id/editbook" exact>
        <EditBook />
      </Route>
      <Route path="/userprivate/:id" exact>
        <UserPrivate />
      </Route>
      <Route path="/createbook/:id" exact>
        <CreateBook />
      </Route>
      <Route path="/private" exact>
        <Private />
      </Route>
      <Route path="/admin" exact>
        <AdminPage />
      </Route>
      <Route path="/bookpage/:id" exact>
        <BookPage />
      </Route>
      <Route path="/:id/">
        <Chapter />
      </Route>
      <Redirect to="/main" />
    </Switch>
  );
};
