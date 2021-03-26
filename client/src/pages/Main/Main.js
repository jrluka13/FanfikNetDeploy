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

export const Main = () => {
  const { request } = useHttp();
  const { token } = useContext(AuthContext);
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
  const [books, setBooks] = useState([]);
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
    books.forEach((data) => {
      if (data.raiting.length !== 0) {
        data.avgRait = data.raiting.reduce((a, b) => a + b.rait, 0);
      } else {
        data.avgRait = 0;
      }
    });
    // setBooks(books)
  });

  useEffect(() => {
    console.log(books);
  }, [books]);

  return (
    <div ref={divRef} className="mainDiv  p-2">
      {books.map((book, index) => {
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
  );
};
