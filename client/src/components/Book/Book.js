import React, { useState,useCallback,useEffect } from "react";
import { Loader } from "../loader/Loader";
import {useHistory} from 'react-router-dom'
import ReactStars from "react-rating-stars-component";
import "./book.css";

function Book({ book, idBook }) {
  const [bookChapter, setBookChapter] = useState();
  let history = useHistory();
  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  const onChapterHandler = (chapter) => {
    setBookChapter(chapter);
  };
  const handleClick = useCallback(() => {
    history.push(`/${idBook}/${bookChapter}`);
  }, [history, bookChapter,idBook]);

  useEffect(() => {
    if (bookChapter) {
      handleClick();
    }
  });

  if (book === undefined) {
    return <Loader />;
  } else {
    return (
      <div>
        <div
          className="row mb-3"
          style={{ maxWidth: "1224px", minWidth: "250px" }}
        >
          <div className="row g-0">
            <div className="col-md-4">
              <img src="" alt="" />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <h3 className="card-title">{book.title}</h3>
                <h6 className="card-subtitle mb-2 mt-2">
                  <small className="text-muted">{book.genre}</small>
                </h6>
                <h6>
                  <small>
                    Tags:
                    {book.tags.map((tag, index) => (
                      <small key={index}> {tag.value} </small>
                    ))}
                  </small>
                </h6>
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
                />

                <p className="card-text">{book.shortDecr}</p>
                <h4 className="card-text">Оглавление</h4>
                {book.chapters.map((chapter, index) => (
                  <p
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={() => onChapterHandler(chapter.name)}
                    key={index}
                  >
                    {chapter.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Book;
