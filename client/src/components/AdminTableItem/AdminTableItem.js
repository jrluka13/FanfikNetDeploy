import React, { useContext, useCallback } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
function AdminTableItem({ userr, onChange }) {
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const { user } = useContext(SwitchCheckedContext);
  const fetchUser = async (id) => {
    try {
      await request(`/api/auth/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      onChange();
    } catch (error) {}
  };
  const updateDataUser = useCallback(
    async (id, value) => {
      try {
        await request(`/api/auth/${id}`, "PUT", value, {
          Authorization: `Bearer ${token}`,
        });
        onChange();
      } catch (error) {}
    },
    [token, request, userr._id]
  );

  const onDeleteHandler = () => {
    fetchUser(userr._id);
  };
  const onChangeStatusHandler = () => {
    if (userr.status === "unblock") {
      updateDataUser(userr._id, { status: "block" });
    } else if (userr.status === "block") {
      updateDataUser(userr._id, { status: "unblock" });
    }
  };

  const onChangeAdminHandler = () => {
    if (!userr.isLogin) {
      updateDataUser(userr._id, { isLogin: true });
    } else if (userr.isLogin) {
      updateDataUser(userr._id, { isLogin: false });
    }
  };

 

  return (
    <tr key={userr._id}>
      <th scope="row">{userr._id}</th>
      <td>{userr.name}</td>
      <td>{userr.email}</td>
      <td>{userr.isLogin ? "True" : "False"}</td>
      <td>{userr.status}</td>
      <td>{userr.superUser ? "True" : "False"}</td>

      {user.superUser && userr.isLogin && userr.superUser ? (
        <>
          {" "}
          <td>
            <button
              onClick={onChangeStatusHandler}
              className="btn btn-primary disabled"
            >
              <FormattedMessage id="block-unblock.btn" />
            </button>
          </td>
          <td>
            <button
              onClick={onChangeAdminHandler}
              className="btn btn-info disabled"
            >
              <FormattedMessage id="isadmin.btn" />
            </button>
          </td>
          <td>
            <button
              onClick={onDeleteHandler}
              className="btn btn-danger disabled"
            >
              <FormattedMessage id="delete.btn" />
            </button>
          </td>
          <td>
            <Link
              to={`/private/${userr._id}`}

              className="btn btn-success disabled"
            >
              <FormattedMessage id="view.btn" />
            </Link>
          </td>
        </>
      ) : !user.superUser && userr.isLogin ? (
        <>
          {" "}
          <td>
            <button
              onClick={onChangeStatusHandler}
              className="btn btn-primary disabled"
            >
              <FormattedMessage id="block-unblock.btn" />
            </button>
          </td>
          <td>
            <button
              onClick={onChangeAdminHandler}
              className="btn btn-info disabled"
            >
              <FormattedMessage id="isadmin.btn" />
            </button>
          </td>
          <td>
            <button
              onClick={onDeleteHandler}
              className="btn btn-danger disabled"
            >
              <FormattedMessage id="delete.btn" />
            </button>
          </td>
          <td>
            <Link
              to={`/private/${userr._id}`}

              className="btn btn-success disabled"
            >
              <FormattedMessage id="view.btn" />
            </Link>
          </td>
        </>
      ) : (
        <>
          {" "}
          <td>
            <button onClick={onChangeStatusHandler} className="btn btn-primary">
              <FormattedMessage id="block-unblock.btn" />
            </button>
          </td>
          <td>
            <button onClick={onChangeAdminHandler} className="btn btn-info">
              <FormattedMessage id="isadmin.btn" />
            </button>
          </td>
          <td>
            <button onClick={onDeleteHandler} className="btn btn-danger">
              <FormattedMessage id="delete.btn" />
            </button>
          </td>
          <td>
            <Link
              to={`/userprivate/${userr._id}`}

              className="btn btn-success"
            >
              <FormattedMessage id="view.btn" />
            </Link>
          </td>
        </>
      )}
    </tr>
  );
}

export default AdminTableItem;
