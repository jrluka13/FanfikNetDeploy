import React, { useContext, useCallback, useEffect, useState } from "react";
import AdminTable from "../../components/AdminTable/AdminTable";
import { Loader } from "../../components/loader/Loader";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
function AdminPage() {
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const [stateUsers, setStateUsers] = useState([]);
  const fetchUsers = useCallback(async () => {
    try {
      const fetched = await request("/api/auth", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setStateUsers(fetched);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  if (!stateUsers) {
    return <Loader />;
  } else {
    return (
      <div>
        <AdminTable users={stateUsers} onChange={fetchUsers} />
      </div>
    );
  }
}

export default AdminPage;
