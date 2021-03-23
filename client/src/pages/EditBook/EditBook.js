import React,{useState,useContext,useCallback,useEffect,useRef} from "react";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import {useParams} from 'react-router-dom'
import { Loader } from "../../components/loader/Loader";
import  EditBookItems  from "../../components/EditBooksItems/EditBookItems";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";

function EditBook(){
  const { checked } = useContext(SwitchCheckedContext);

    const [book, setBook] = useState([]);
    const { loading, request } = useHttp();
    const { token } = useContext(AuthContext);
    const divRef= useRef(null);

    useEffect(()=>{
      if (checked) {
        let theme = JSON.parse(localStorage.getItem("theme"));

        divRef.current.classList.add(theme["bg-dark"]);
        // titleRef.current.style.color = 'black'
        // genreRef.current.style.color = 'black'
        // imgLabelRef.current.style.color = 'black'
        // descrRef.current.style.color = 'black'
        // chapterRef.current.style.color = 'black'
        // tagRef.current.style.setProperty('color','black','important')
        // console.log(tagRef.current.style);
      } else if (!checked) {
        divRef.current.classList.remove("bg-dark");
      }
    },[divRef, checked])
      let idBook = useParams()
    const fetchBooks = useCallback(async () => {
      try {
        const fetched = await request(`/api/book/${idBook.id}`, "GET", null, {
          Authorization: `Bearer ${token}`,
        });
        setBook(fetched);
      } catch (error) {}
    }, [token, request,idBook]);

    useEffect(() => {
      fetchBooks();
    }, [fetchBooks]);



    return(
        <div ref={divRef} className="mainDiv mb-5">
        {loading && book.length!==undefined ? <Loader/> : <EditBookItems idBook={idBook} book={book} onChange={fetchBooks}/>}
      </div>
    )
}
export default EditBook