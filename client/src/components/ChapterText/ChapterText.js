import React from "react";
import { Link } from "react-router-dom";
import { Loader } from "../loader/Loader";

export const ChapterText = ({ loading, book, name }) => {
  // console.log(name);
  // console.log(book._id);
  if (book.chapters === undefined) {
    return <Loader />;
  } else {
    return (
      <div className="container">
        {book.chapters.map((chapter, index) => {
          if (chapter.name === name) {
            return (
              <div className="p-3 row" key={index}>
                <h1 className="text-center mt-2 mb-3">{chapter.name}</h1>
                <p>
                  {chapter.urlImgChapter && (
                    <img
                      style={{ width: "30%", float: "left" }}
                      className="rounded-3 me-2"
                      src={chapter.urlImgChapter}
                      alt="img"
                    />
                  )}
                  {chapter.text}
                </p>

              </div>
            );
          }
        })}
        <nav className="d-flex justify-content-center" aria-label="...">
          <ul className="pagination pagination-lg">
            {book.chapters.map((chapter, index) => {
              return (
                <li className="page-item">
                  <Link
                    className="page-link"
                    to={`/${book._id}/${chapter.name}`}
                  >
                    {index + 1}
                  </Link>
                </li>
              );
            })}
            {/* <li className="page-item active" aria-current="page">
              <span className="page-link">1</span>
            </li>
            <li className="page-item">
              <Link className="page-link" to="#">
                2
              </Link>
            </li>
            <li className="page-item">
              <Link className="page-link" to="#">
                3
              </Link>
            </li> */}
          </ul>
        </nav>
      </div>
    );
  }
};
