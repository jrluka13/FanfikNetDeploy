import React, { useContext, useEffect, useState, useCallback } from "react";
import { Loader } from "../../components/loader/Loader";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { injectIntl, FormattedMessage } from "react-intl";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import bcrypt from "bcryptjs";

function GroupInput({ intl }) {
  const [userData, setUserData] = useState();
  const { user } = useContext(SwitchCheckedContext);
  const { token, userId } = useContext(AuthContext);
  const { request } = useHttp();

  useEffect(() => {
    if (user !== undefined) {
      setUserData({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    }
  }, [user]);

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

  const onDataHandler = async (e) => {
    let key = e.target.placeholder;
    console.log();
    if (e.target.placeholder === "password") {
      const hashedPassword = await bcrypt.hash(e.target.value, 12);
      console.log(hashedPassword);
      updateDataUser({ [key]: hashedPassword });
    } else {
      updateDataUser({ [key]: e.target.value });
    }
  };

  return (
    <>
      {userData === undefined ? (
        <Loader />
      ) : (
        <div className="d-flex flex-row">
          <div className="m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="name" />
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="name"
              defaultValue={userData.name}
              onBlur={(e) => onDataHandler(e)}
            />
          </div>
          <div className="m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="email-addres" />
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="email"
              defaultValue={userData.email}
              onBlur={(e) => onDataHandler(e)}
            />
          </div>
          <div className="m-4">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              <FormattedMessage id="password" />
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="password"
              id="password"
              defaultValue={userData.password}
              onBlur={(e) => onDataHandler(e)}
            />
          </div>


        </div>
      )}
    </>
  );
}

export default injectIntl(GroupInput);
