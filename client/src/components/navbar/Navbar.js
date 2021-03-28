import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import locales from "../../locales/locales";
import { FormattedMessage } from "react-intl";
import { useHttp } from "../../hooks/http.hook";
import { SearchBox } from "react-instantsearch/dom";

export const Navbar = ({
  value,
  onChange,
  updateData,
  findUser,
  findUsers,
  isLogin,
  userAdmin,
}) => {
  const { isAuthenticated, logout, token, userId } = useContext(AuthContext);
  const [placeholder, setPlaceholder] = useState("");
  const [checked, setChecked] = useState(null);
  const checkbox = useRef();
  const { request } = useHttp();
  // const { token, userId } = useContext(AuthContext);
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    value === "RU" ? setPlaceholder("Поиск") : setPlaceholder("Search");
  }, [value]);

  const nav = document.querySelector(".navbar");
  const body = document.body;

  useEffect(() => {
    if (localStorage.getItem("theme") == null) {
      updateData(false);
      body.style.color = "#212529";
      document.getElementById("wrapper").style.background =
        "linear-gradient(-135deg, #c850c0, #4158d0)";

      if (nav) {
        nav.classList.add("bg-light");
        nav.classList.remove("bg-dark");
        nav.classList.add("navbar-light");
        nav.classList.remove("navbar-dark");
      }
    } else {
      setChecked(true);
      updateData(checked);
      checkbox.current.checked = true;
      if (checked) {
        if (nav) {
          let theme = JSON.parse(localStorage.getItem("theme"));
          document.getElementById("wrapper").style.background =
            "linear-gradient(-135deg, #e04000, #000000)";

          nav.classList.remove("bg-light");
          nav.classList.add(theme["bg-dark"]);
          nav.classList.remove("navbar-light");
          nav.classList.add("navbar-dark");
          body.style.color = "#fff";
        }
      }
    }
  }, [checked, nav, updateData, body.style]);

  const themeHandler = (e) => {
    updateData(e.target.checked);
    setChecked(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem(
        "theme",
        JSON.stringify({
          "bg-dark": "bg-dark",
        })
      );
    } else if (!e.target.checked) {
      localStorage.removeItem("theme");
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const fetched = await request("/api/auth", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setUsers(fetched);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    // console.log(users);
    findUsers(users);
  }, [users, findUsers]);

  useEffect(() => {
    const userArr = users.filter((user) => user._id === userId);
    setUser(userArr[0]);
  }, [users, userId]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    findUser(user);
  }, [user, findUser]);
  if (user !== undefined) {
    isLogin(user.isLogin);
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/main">
            <FormattedMessage id="nav.title" />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isAuthenticated ? (
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink
                    className="nav-link "
                    aria-current="page"
                    to="/private"
                  >
                    <FormattedMessage id="my-books.title" />
                  </NavLink>
                </li>
                {userAdmin && (
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      aria-current="page"
                      to="/admin"
                    >
                      <FormattedMessage id="adminka" />
                    </NavLink>
                  </li>
                )}
              </ul>
            ) : null}
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                aria-label="Search"
                placeholder={placeholder}
              />
              {/* <SearchBox  type="search" /> */}
              <button
                className="btn btn-outline-success"
                type="submit"
                style={{ marginRight: "10%" }}
              >
                <FormattedMessage id="search.btn" />
              </button>
              <div className="form-check form-switch m-1">
                <input
                  onChange={(e) =>
                    // setSwitchVal(e.target.checked)
                    themeHandler(e)
                  }
                  ref={checkbox}
                  style={{ height: 20, width: 40 }}
                  className="form-check-input"
                  type="checkbox"
                  id="flexSwitchCheckDefault"
                />
              </div>
              <select
                className="ms-1"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              >
                <option value={locales.RU}>RU</option>
                <option value={locales.EN}>EN</option>
              </select>

              {isAuthenticated ? (
                <NavLink
                  to="/main"
                  onClick={logout}
                  className="btn btn-danger ms-1"
                >
                  <FormattedMessage id="nav-logout.btn" />
                </NavLink>
              ) : (
                <NavLink to="/" className="btn btn-warning ms-1">
                  <FormattedMessage id="nav-login.btn" />
                </NavLink>
              )}
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
};
