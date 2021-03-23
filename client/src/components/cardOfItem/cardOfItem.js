import React, { useContext, useRef, useEffect,useState, useCallback } from "react";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { useHistory } from "react-router-dom";

export const CardOfItem = ({data}) => {
  const [bookId, setBookId] = useState();
  let history = useHistory();
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
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
  const handleClick= useCallback(()=>{
    history.push(`${bookId}`);
  },[history,bookId])

  useEffect(() => {
    if (bookId) {
      handleClick();
    }
    // handleClick(bookId)
  }, [bookId,handleClick]);
  // useEffect(()=>{
  //   console.log(bookId);
  // },[bookId])
  return (
    <div>
      <div className="row m-2">
        <div className="col-sm-4">
          <div className="card">
            <div className="card">
              <img src="" alt="" />
            </div>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="card">
            <div className="card-body" ref={divRef}>
              <h5 className="card-title">{data.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {data.genre}
              </h6>
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
