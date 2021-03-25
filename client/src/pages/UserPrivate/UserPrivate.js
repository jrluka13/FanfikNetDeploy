import React, { useState, useContext, useEffect, useCallback } from "react";
import InputsUserPrivate from "../../components/InputsUSerPrivate/InputsUserPrivate";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { BooksList } from "../../components/BooksList/BooksList";
import { Loader } from "../../components/loader/Loader";
export const UserPrivate = () => {
  const [booksAll, setBooks] = useState([]);
  const [booksUser, setBooksUser] = useState([]);
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const userId = useParams().id;
  const fetchBooks = useCallback(async () => {
    try {
      const fetched = await request("/api/book/books", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setBooks(fetched);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  useEffect(() => {
    if (booksAll !== 0) {
      let arrBooks = booksAll.filter((booksAll) => booksAll.owner === userId);
      setBooksUser(arrBooks);
    }
  }, [booksAll, userId]);
  if (booksUser.length === 0) {
    return <Loader />;
  } else
    return (
      <div>
        <InputsUserPrivate />
        <div className="d-flex justify-content-center">

        <div className="mt-5">
          <BooksList books={booksUser} userId={userId} onChange={fetchBooks} />
        </div>
        </div>
      </div>
    );
};
