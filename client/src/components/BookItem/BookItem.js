import React, { useCallback, useEffect, useState,useContext } from "react";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";

export const BookItem = ({ book, index, onChange }) => {
  const [bookId, setBookId] = useState();
  let history = useHistory();
  const {request } = useHttp();
  const { token } = useContext(AuthContext);
  // new TableSort(document.getElementById('tableRef'))
  const fetchBooks = (async (id) => {
    try {
      await request(`/api/book/${id}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      onChange();
    } catch (error) {}
  });



  const onOpenHandler = (book) => {
    setBookId(book._id);
  };

  const onDeleteHandler = (book)=>{
    fetchBooks(book._id)
   };

   const onEditHandler=(book)=>{
    history.push(`/${book._id}/editbook`)
   }

  const handleClick = useCallback(() => {
    history.push(`/bookpage/${bookId}`);
  }, [history, bookId]);

  useEffect(() => {
    if (bookId) {
      handleClick();
    }
    // handleClick(bookId)
  }, [bookId, handleClick]);
  return (
    <tr key={book._id}>
      <th scope="row">{index + 1}</th>
      <td>{book.title}</td>
      <td>{book.genre}</td>
      <td>{book.owner}</td>
      <td>
        <button
          onClick={() => {
            onOpenHandler(book);
          }}
          className="btn btn-primary"
        >
          <FormattedMessage id="open.btn" />
        </button>
      </td>
      <td>
        <button
          onClick={() => {
            onDeleteHandler(book);
          }}
          className="btn btn-danger"
        >
          <FormattedMessage id="delete.btn" />
        </button>
      </td>
      <td>
        <button
          onClick={() => {
            onEditHandler(book);
          }}
          className="btn btn-info"
        >
          <FormattedMessage id="edit.btn" />
        </button>
      </td>
    </tr>
  );
};
