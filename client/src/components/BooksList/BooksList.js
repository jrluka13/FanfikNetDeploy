import React, { useRef } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useParams } from "react-router-dom";
import { BookItem } from "../BookItem/BookItem";

export const BooksList = ({ books,userId, onChange }) => {
  // const tableRef = useRef();
  // if (tableRef.current !== undefined) {
  //   // new TableSort(tableRef);
  //   console.log(tableRef.current);
  // } else {
  //   console.log(21);
  // }

  // console.log(tableRef.current);

  if (!books.length) {
    return (
      <div className="d-flex justify-content-center">
        <Link to={`/createbook/${userId}`} className="btn btn-success">
          <FormattedMessage id="create.btn" />
        </Link>
      </div>
    );
  }
  return (
    <table
      id="tableRef"
      className="table table-light table-striped table-hover"
    >
      <thead>
        <tr>
          <th scope="col">
            <Link to={`/createbook/${userId}`} className="btn btn-success">
              <FormattedMessage id="create.btn" />
            </Link>
          </th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <thead>
        <tr>
          <th scope="col">№</th>
          <th scope="col">
            <FormattedMessage id="title" />
          </th>
          <th scope="col">
            <FormattedMessage id="genre" />
          </th>
          <th scope="col">OwnerId</th>
          <th scope="col">
            <FormattedMessage id="open.btn" />
          </th>
          <th scope="col">
            <FormattedMessage id="delete.btn" />
          </th>
          <th scope="col">
            <FormattedMessage id="edit.btn" />
          </th>
        </tr>
      </thead>
      <tbody>
        {books.map((book, index) => {
          return (
            <BookItem
              key={index}
              book={book}
              index={index}
              onChange={onChange}
            />
          );
        })}
      </tbody>
    </table>
  );
};
