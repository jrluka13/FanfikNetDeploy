import React, { useContext, useState, useEffect, useRef } from "react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { FormattedMessage, injectIntl } from "react-intl";
import "./index.css";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";

function Auth({ intl }) {
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
  // console.log(checked);
  useEffect(() => {
    if (checked) {
      let theme = JSON.parse(localStorage.getItem("theme"));

      divRef.current.classList.add(theme["bg-dark"]);
    } else if (!checked) {
      divRef.current.classList.remove("bg-dark");
    }
  }, [divRef, checked]);

  const placeholder_psw = intl.formatMessage({ id: "password-placeholder" });
  const placeholder_mail = intl.formatMessage({ id: "email-placeholder" });

  const auth = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { loading, request } = useHttp();

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });

      console.log("Data", data);
    } catch (error) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      if (data.status === "block") {
        alert("This user is blocked");
      } else {
        auth.login(data.token, data.userId);
      }
    } catch (error) {}
  };

  return (
    <div ref={divRef} className="divAuth  p-3 d-flex justify-content-center ">
      <form>
        <div className="mb-3">
          <div className="text-center">
            <h2>
              <FormattedMessage id="authorization" />
            </h2>
          </div>
          <label htmlFor="email" className="form-label">
            <FormattedMessage id="email-addres" />
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder={placeholder_mail}
            name="email"
            onChange={changeHandler}
          />
          <div id="emailHelp" className="form-text">
            <FormattedMessage id="helper-auth" />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            <FormattedMessage id="password" />
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder={placeholder_psw}
            onChange={changeHandler}
          />
        </div>
        <div className="d-flex flex-row justify-content-center">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            onClick={loginHandler}
          >
            <FormattedMessage id="nav-login.btn" />
          </button>
          <button
            type="submit"
            className="btn btn-success ms-2"
            onClick={registerHandler}
            disabled={loading}
          >
            <FormattedMessage id="register.btn" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default injectIntl(Auth);
