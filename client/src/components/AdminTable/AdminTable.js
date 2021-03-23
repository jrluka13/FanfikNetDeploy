import React from "react";
import { FormattedMessage } from "react-intl";
import AdminTableItem from "../AdminTableItem/AdminTableItem";
import { Loader } from "../loader/Loader";

function AdminTable({ users, onChange }) {
  if (users.length === 0) {
    return <Loader />;
  } else {
    return (
      <table className="table table-light table-striped table-hover">
        <thead className="table-light">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">
              <FormattedMessage id="name" />
            </th>
            <th scope="col">
              <FormattedMessage id="email" />
            </th>
            <th scope="col">
              <FormattedMessage id="isadmin" />
            </th>
            <th scope="col">
              <FormattedMessage id="status" />
            </th>
            <th scope="col">
              <FormattedMessage id="superuser" />
            </th>
            <th scope="col">
            </th>
            <th scope="col">
            </th>
            <th scope="col">
            </th>
            <th scope="col">
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <AdminTableItem
                key={index}
                userr={user}
                onChange={onChange}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default AdminTable;
