import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router";
import { Loader } from "../../components/loader/Loader";
import { ChapterText } from "../../components/ChapterText/ChapterText";
import {SwitchCheckedContext} from '../../context/SwitchCheckedContext'
function Chapter() {
  const [book, setBook] = useState([]);
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);
  let idBook = useParams();
  const { checked } = useContext(SwitchCheckedContext);

  const divRef = useRef(null);

  // console.log(divRef.current);
  useEffect(() => {
    if (checked) {
      let theme = JSON.parse(localStorage.getItem("theme"));

      divRef.current.classList.add(theme["bg-dark"]);
    } else if (!checked) {
      divRef.current.classList.remove("bg-dark");
    }
  }, [divRef, checked]);

  const fetchBooks = useCallback(async () => {
    try {
      const fetched = await request(`/api/book/${idBook.id}`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setBook(fetched);
    } catch (error) {}
  }, [token, request, idBook]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div ref={divRef} className="mainDiv">
      {loading && book.length !== undefined ? (
        <Loader />
      ) : (
        <ChapterText loading={loading} book={book} />
      )}
    </div>
  );
}

export default Chapter;
