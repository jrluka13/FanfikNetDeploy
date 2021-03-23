import React, { useContext, useState, useEffect, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { useParams } from "react-router-dom";
import { Loader } from "../loader/Loader";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
function InputsUserPrivate() {
  const [user, setUser] = useState();
  const { users } = useContext(SwitchCheckedContext);
  const userId = useParams().id;
  const { token } = useContext(AuthContext);
  const { request } = useHttp();
  useEffect(() => {
    if (users !== undefined) {
      const userArr = users.filter((user) => user._id === userId);
      setUser(userArr[0]);
    }
  }, [users, userId]);

  // useEffect(() => {
  //   console.log(user);
  // }, [user]);

  const updateDataUser = useCallback(
    async (value) => {
      try {
        const fetched = await request(`/api/auth/${userId}`, "PUT", value, {
          Authorization: `Bearer ${token}`,
        });
        console.log(fetched);
      } catch (error) {}
    },
    [token, request, userId]
  );

  const onDataHandler = (e) => {
    let key = e.target.placeholder;
    updateDataUser({ [key]: e.target.value });
  };
  if (user === undefined) {
    return <Loader />;
  } else
    return (
      <div>
        <h2 className="text-center">{user.name} Profile</h2>
        <div className="row g-1 ">
          <div className="col-md m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="name" />
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="name"
              defaultValue={user.name}
              onBlur={(e) => onDataHandler(e)}
            />
          </div>
          <div className="col-md m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="email-addres" />
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="email"
              defaultValue={user.email}
              onBlur={(e) => onDataHandler(e)}
            />
          </div>
          <div className="col-md m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="password" />
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="password"
              id="password"
              defaultValue={user.password}
              onBlur={(e) => onDataHandler(e)}
            />
          </div>

          <div className="col-md m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="url_images" />
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="url"
              aria-label="Disabled input example"
              disabled
            />
          </div>
        </div>{" "}
      </div>
    );
}

export default InputsUserPrivate;
