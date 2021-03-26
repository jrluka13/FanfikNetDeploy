import React, {
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { useHistory } from "react-router-dom";
import { Loader } from "../loader/Loader";

export const CardOfItem = ({ data }) => {
  const [bookId, setBookId] = useState();
  let history = useHistory();
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
  const [rait, setRait] = useState();

  useEffect(() => {
    if (checked) {
      let theme = JSON.parse(localStorage.getItem("theme"));

      divRef.current.classList.add(theme["bg-dark"]);
    } else if (!checked) {
      divRef.current.classList.remove("bg-dark");
    }
  }, [divRef, checked]);
  const onOpenHandler = (book) => {
    setBookId(book);
  };
  const handleClick = useCallback(() => {
    history.push(`/bookpage/${bookId}`);
  }, [history, bookId]);

  useEffect(() => {
    if (bookId) {
      handleClick();
    }
  }, [bookId, handleClick]);

  // useEffect(() => {
  //   if (data.avgRait) {
  //     setRait(data?.avgRait);
  //     console.log(123);
  //   }
  //   console.log(1234);
  // }, [setRait]);
  // useEffect(() => {
  //   console.log(rait);
  // }, [rait]);
  return (
    <div>
      <div className="row m-2">
        <div className="col-sm-3">
          <div className="card">
            <div className="card">
              <img src={data.urlImg} alt="" />
            </div>
          </div>
        </div>
        <div className="col-sm-9">
          <div className="card">
            <div className="card-body" ref={divRef}>
              <h5 className="card-title">{data.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">{data.genre}</h6>
              <div>
                {data.avgRait ? (
                  <small className="card-subtitle mb-2 text-muted">
                    Рейтинг : 1
                  </small>
                ) : null}
              </div>

              <p className="card-text">{data.shortDecr}</p>
              <button
                onClick={() => {
                  onOpenHandler(data._id);
                }}
                className="btn btn-primary"
              >
                Read
              </button>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};
