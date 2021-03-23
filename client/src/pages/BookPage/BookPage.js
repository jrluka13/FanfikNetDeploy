import React,{useCallback,useContext, useState, useEffect,useRef} from "react";
import {useParams} from 'react-router-dom'
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import Book from "../../components/Book/Book";
import { Loader } from "../../components/loader/Loader";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";

function BookPage() {

    const {  loading,request } = useHttp();
    const { token } = useContext(AuthContext);
    let idBook = useParams();
    const [book,setBook] = useState()
    const { checked } = useContext(SwitchCheckedContext);
    const divRef = useRef(null);

    // console.log(divRef.current);
    useEffect(() => {
      if (checked) {
        let theme = JSON.parse(localStorage.getItem("theme"));

        divRef.current.classList.add(theme["bg-dark"]);
      } else if (!checked ) {
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
      }, [token, request,idBook.id]);

      useEffect(() => {
        fetchBooks();
      }, [fetchBooks]);


  return (
    <div className="mainDiv" ref={divRef}>
      {loading ? <Loader/> : <Book book={book} idBook={idBook.id}/>}
    </div>
  );
}

export default BookPage;
