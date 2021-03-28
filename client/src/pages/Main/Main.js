import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { CardOfItem } from "../../components/cardOfItem/cardOfItem";
import "./index.css";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { CloudTags } from "../../components/CloudTags/CloudTags";
import { Loader } from "../../components/loader/Loader";

export const Main = () => {
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
  const [books, setBooks] = useState([]);
  const [arrBooks, setArrBooks] = useState([]);

  const [visibility,setVisibility] = useState({
    "visibility" : "hidden"
  })
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
      const fetched = await request("/api/book/books", "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      setBooks(fetched);
    } catch (error) {}
  }, [token, request]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);
  // useEffect(() => {
  //   console.log(books);
  // }, [books]);
  useEffect(() => {
    let arr = [];
    let obj = {};
    books.map((data) => {
      if (data.raiting.length !== 0) {
        obj = {
          ...data,
          avgRait: data.raiting.reduce((a, b) => a + b.rait, 0),
        };
        arr.push(obj);
      } else {
        obj = {
          ...data,
          avgRait: 0,
        };
        arr.push(obj);
      }
    });
    arr.sort((a, b) => (a.avgRait < b.avgRait ? 1 : -1));
    setArrBooks(arr);
  }, [books, setArrBooks]);



  return (
    <div className="d-flex flex-column">
      {arrBooks.length === 0 ? (
        <>
        <Loader />
        <CloudTags books={arrBooks} visibility = {visibility} />
        <div style={{visibility:"hidden"}} ref={divRef} className="mainDiv  p-2">
          {arrBooks.map((book, index) => {
            return (
              
              <CardOfItem
                // title={card.title}
                // subtitle={card.subtitle}
                // text={card.text}
                data={book}
                key={index}
              />
            );
          })}
        </div>
        </>

      ) : (
        <>
          <CloudTags books={arrBooks} />
          <div ref={divRef} className="mainDiv  p-2">
            {arrBooks.map((book, index) => {
              return (
                <CardOfItem
                  // title={card.title}
                  // subtitle={card.subtitle}
                  // text={card.text}
                  data={book}
                  key={index}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
