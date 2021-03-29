import React, { useContext, useState, useEffect, useRef } from "react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { FormattedMessage, injectIntl } from "react-intl";
import "./index.css";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";

function Auth({ intl }) {
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
  const { users } = useContext(SwitchCheckedContext);
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

  const logSocialNet = (email, password, name) => {
    try {
      users.forEach(async (user) => {
        if (user.email === email) {
          try {
            const data = await request("/api/auth/login", "POST", {
              email,
              password,
            });
            if (data.status === "block") {
              alert("This user is blocked");
            } else {
              auth.login(data.token, data.userId);
            }
          } catch (error) {}
        } else {
          try {
            const responseData = await request("/api/auth/register", "POST", {
              email,
              password,
              name,
            });
            console.log(responseData);
            const data = await request("/api/auth/login", "POST", {
              email,
              password,
            });
            if (data.status === "block") {
              alert("This user is blocked");
            } else {
              auth.login(data.token, data.userId);
            }
          } catch (error) {}
        }
      });
    } catch (error) {}
  };

  const responseGoogle = (response) => {
    logSocialNet(
      response.profileObj.email,
      response.profileObj.googleId,
      response.profileObj.givenName
    );
  };
  
  const responseFacebook = (response) => {

    logSocialNet(response.email, response.userID, response.name);
  };

  const componentClicked = () => {
    console.log("Facebook log");
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
          <div className="col-12">
            <label htmlFor="email" className="col-sm-5 col-form-label">
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
          </div>

          <div id="emailHelp" className="form-text">
            <FormattedMessage id="helper-auth" />
          </div>
        </div>
        <div className="mb-3 col-sm-12">
          <label htmlFor="password" className="col-sm-2 col-form-label">
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
        <div className="d-flex justify-content-center">
          <div className="row">
            <div className="col-auto mb-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                onClick={loginHandler}
              >
                <FormattedMessage id="nav-login.btn" />
              </button>
            </div>
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-success"
                onClick={registerHandler}
                disabled={loading}
              >
                <FormattedMessage id="register.btn" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <div className="row ">
            <div className="col-auto">
              <GoogleLogin
                style={{}}
                className="mb-2"
                clientId="168899398396-fgobrnuuu7nfje0sa2j8dpb2c71q70kf.apps.googleusercontent.com"
                buttonText="Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={"single_host_origin"}
              />
            </div>
            <div className="col-auto">
              <FacebookLogin
                buttonStyle={{
                  height: "10px",
                  textTransform: "none",
                  fontWeight: "bold",
                  border: "1px solid #4c69ba",
                  paddingBottom: "27px",
                  paddingTop: "15px",
                  borderRadius: "25px",
                  fontSize: "10px",
                }}
                appId="898634117622396"
                autoLoad={false}
                fields="name,email,picture"
                onClick={componentClicked}
                callback={responseFacebook}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default injectIntl(Auth);
