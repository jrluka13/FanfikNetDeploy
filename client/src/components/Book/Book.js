import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { Loader } from "../loader/Loader";
import { useHistory } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import "./book.css";
import { FormattedMessage } from "react-intl";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";

function Book({ book, idBook }) {
  const [bookChapter, setBookChapter] = useState();
  const [starsKey, setStarsKey] = useState(Math.random());
  const [bookRating, setBookRating] = useState(null);
  const [isBookRated, setBookRated] = useState(false);
  const { user } = useContext(SwitchCheckedContext);
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const [comments, setCommets] = useState();
  const [allRait, allSetRait] = useState();

  const comentInpRef = useRef();
  let history = useHistory();


  useEffect(() => {
    allRait?.forEach((raitItem) => {
      if (user?._id === raitItem.userId) {
        setBookRating(raitItem.rait);
        setBookRated(true);
        setStarsKey(Math.random());
      }
    });
  }, [user?._id, allRait]);

  const ratingChanged = (newRating) => {
    let count = 0;
    // console.log(book.raiting.indexOf({userId:user._id}));

    book.raiting.forEach((obj) => {
      if (obj.userId === user?._id) {
        // console.log({ userId: obj.userId, rait: newRating });
        count = 1;
        console.log(count);
        updateRait(idBook, "raiting", { userId: obj.userId, rait: newRating });
      }
    });

    if (count === 0) {
      updateDataBook(idBook, "raiting", { userId: user?._id, rait: newRating });
    }
  };

  const updateRait = useCallback(
    async (id, obj, value) => {
      try {
        await request(`/api/book/${id}/${obj}/uprait`, "PUT", value, {
          Authorization: `Bearer ${token}`,
        });
        // onChange();
        // getCommetsBook();
      } catch (error) {}
    },
    [token, request]
  );

  const getRait = useCallback(async () => {
    try {
      const fetched = await request(`/api/book/${idBook}/rait`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      allSetRait(fetched);
    } catch (error) {}
  }, [token, request, idBook]);

  useEffect(() => {
    getRait();
  }, [getRait]);

  useEffect(() => {
    console.log(allRait);
  }, [allRait]);

  const onChapterHandler = (chapter) => {
    setBookChapter(chapter);
  };
  const handleClick = useCallback(() => {
    history.push(`/${idBook}/${bookChapter}`);
  }, [history, bookChapter, idBook]);

  useEffect(() => {
    if (bookChapter) {
      handleClick();
    }
  });

  const getCommetsBook = useCallback(async () => {
    try {
      const fetched = await request(
        `/api/book/${idBook}/comments`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setCommets(fetched);
    } catch (error) {}
  }, [token, request, idBook]);
  useEffect(() => {
    getCommetsBook();
  }, [getCommetsBook]);
  // setInterval(()=>getCommetsBook(),10000)

  const updateDataBook = useCallback(
    async (id, arr, value) => {
      try {
        await request(`/api/book/${id}/${arr}`, "PUT", value, {
          Authorization: `Bearer ${token}`,
        });
        // onChange();
        getCommetsBook();
      } catch (error) {}
    },
    [token, request, getCommetsBook]
  );

  const onCometHandler = () => {
    // console.log(idBook, "comments", { [user.name]: comentInpRef.current.value });
    updateDataBook(idBook, "comments", {
      user: user.name,
      text: comentInpRef.current.value,
      date: `${new Date().getDate()}.${
        new Date().getMonth() + 1
      }.${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    });
    comentInpRef.current.value = ""

  };
  // console.log(isBookRated);

  if (book === undefined) {
    return <Loader />;
  } else {
    return (
      <div>
        <div
          className="row mb-3"
          style={{ maxWidth: "1224px", minWidth: "250px" }}
        >
          <div className="row m-2">
            <div className="col-sm-4">
              <div className="card">
                <div className="card">
                  <img src={book.urlImg} alt="" />
                </div>
              </div>
            </div>
            <div className="col-sm-8">
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
                {user?._id !== undefined && isBookRated ? (
                  <ReactStars
                    key={starsKey}
                    count={5}
                    value={bookRating}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                  />
                ) : (
                  <ReactStars
                    key={starsKey}
                    count={5}
                    value={0}
                    onChange={ratingChanged}
                    size={24}
                    activeColor="#ffd700"
                  />
                )}

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
        <div className="d-flex flex-column justify-content-center mt-3">
          <h3 className="text-center">
            <FormattedMessage id="leave-comment" />
          </h3>
          <div className="container mb-3">
            <div className="row">
              <div className="col-10 form-floating">
                <input
                  ref={comentInpRef}
                  type="text"
                  className="form-control"
                  id="comment"
                  placeholder="comment"
                />
                <label
                  style={{ color: "black" }}
                  className=""
                  htmlFor="comment"
                >
                  <FormattedMessage id="comment" />
                </label>
              </div>
              <div className="col-1 m-2">
                {user?._id === undefined ? <button onClick={onCometHandler} className="btn btn-success disabled">
                  <FormattedMessage id="submit" />
                </button> : <button onClick={onCometHandler} className="btn btn-success">
                  <FormattedMessage id="submit" />
                </button>}

              </div>
            </div>
          </div>
          {comments &&
            comments.map((comment, index) => {
              return (
                <div
                  key={index}
                  className="me-2 ms-2 mb-3 rounded"
                  style={{ background: "#e3e3e3" }}
                >
                  <div
                    style={{ border: "solid 2px #a8a8a8", color: "black" }}
                    className="m-2  rounded ps-2 pt-2"
                  >
                    <h6>
                      {comment.user}
                      <small className="ms-1">{comment.date}</small>
                    </h6>
                    <p>{comment.text}</p>
                  </div>
                </div>
              );
            })}

        </div>
      </div>
    );
  }
}

export default Book;
