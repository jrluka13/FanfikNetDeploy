import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import Tagify from "@yaireo/tagify";
import "./index.css";
import "@yaireo/tagify/dist/tagify.css";
import { useDropzone } from "react-dropzone";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import { injectIntl, FormattedMessage } from "react-intl";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { useParams } from "react-router";

function CreateBook({ intl }) {
  const { checked } = useContext(SwitchCheckedContext);
  const divRef = useRef(null);
  const titleRef = useRef(null);
  const genreRef = useRef(null);
  const imgLabelRef = useRef(null);
  const descrRef = useRef(null);
  const chapterRef = useRef(null);
  const tagRef = useRef(null)
  const userId = useParams().id;
  console.log(userId);


  useEffect(() => {
    if (checked) {
      let theme = JSON.parse(localStorage.getItem("theme"));

      divRef.current.classList.add(theme["bg-dark"]);
      titleRef.current.style.color = 'black'
      genreRef.current.style.color = 'black'
      imgLabelRef.current.style.color = 'black'
      descrRef.current.style.color = 'black'
      chapterRef.current.style.color = 'black'
      // tagRef.current.style.setProperty('color','black','important')
      // console.log(tagRef.current.style);
    } else if (!checked) {
      divRef.current.classList.remove("bg-dark");
    }
  }, [divRef, checked]);
  const [selectedTab, setSelectedTab] = useState("write");
  const [text, setText] = useState();
  const placeholderTags = intl.formatMessage({ id: "write-some-tags" });

  const auth = useContext(AuthContext);
  const genres = [
    intl.formatMessage({ id: "genre-horor" }),
    intl.formatMessage({ id: "genre-health" }),
    intl.formatMessage({ id: "genre-erotica" }),
    intl.formatMessage({ id: "genre-science" }),
    intl.formatMessage({ id: "genre-fantasy" }),
  ];

  const { request } = useHttp();
  const [files, setFiles] = useState([]);
  const [chapter, setChapter] = useState([]);
  const [dataBook, setDataBook] = useState({
    title: "",
    genre: "",
    tags: "",
    shortDecr: "",
    chapters: "",
    userId
  });
  let arr = [];
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    let input = document.querySelector("input[name=basic]");
      new Tagify(input, {
        enforceWhitelist: true,
        delimiters: null,
        whitelist: [
          "erotica",
          "fantasy",
          "sciense",
          "health",
          "sport",
          "magic",
          "horror",
          "triller",
        ],
        callbacks: {
          add: console.log, // callback when adding a tag
          remove: console.log, // callback when removing a tag
        },
      });
  }, []);

  const images = files.map((file) => (
    <div key={file.name}>
      <img
        src={file.preview}
        style={{
          width: "100%",
          marginTop: "10px",
          borderRadius: "25px",
        }}
        alt="preview"
      />
    </div>
  ));

  const AddChapter = () => {
    // setCounter((prevCount) => prevCount + 1);
    // let text = document.getElementById("chapterText").value;
    let nameOfChapter = document.getElementById("nameOfChapter").value;

    arr.push(text);
    arr.map((el) => {
      return(
        setChapter((prev) => {
          return [
            ...prev,
            {
              name: nameOfChapter[0].toUpperCase() + nameOfChapter.slice(1),
              text: el,
            },
          ];
        })
      )

    });
    setText("");
    document.getElementById("nameOfChapter").value = "";
  };

  const postBook = async () => {
    let title = document.getElementById("title").value;
    let genre = document.getElementById("genre").value;
    let tags = JSON.parse(document.getElementById("Tags").value);
    let shortDecr = document.getElementById("shortDecr").value;
   
    await setDataBook(() => {
      return {
        title,
        genre,
        tags,
        shortDecr,
        chapters: chapter
      };
    });

    console.log(dataBook);
  };

  const createBook = useCallback(async ()=>{
    try {
      const data = await request(`/api/book/generate/${userId}`, "POST", dataBook, {
        Authorization: `Bearer ${auth.token}`,
      });
      console.log(data);
      setChapter([]);
    } catch (error) {}
  },[request,auth.token,dataBook])



  useEffect( () => {
    if(userId !== undefined){
     createBook();
    }
  }, [dataBook,createBook]);
  return (
    <div ref={divRef} className="mainDiv p-2 ">
      <div className="d-flex justify-content-center mt-2">
        <h1>
          <FormattedMessage id="create-new-book" />
        </h1>
      </div>
      <div className="row g-5 mt-1">
        <div className="col-md ">
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Title"
            />
            <label ref={titleRef} htmlFor="title">
              <FormattedMessage id="title" />
            </label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <select
              className="form-select"
              id="genre"
              aria-label="Floating label select example"
            >
              <option defaultValue="...">...</option>
              {genres.map((genre, index) => {
                return (
                  <option key={index} defaultValue={genre}>
                    {genre}
                  </option>
                );
              })}
            </select>
            <label ref={genreRef} htmlFor="genre">
              <FormattedMessage id="choose-your-genre" />
            </label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <input
              ref={tagRef}
              className="inputTag"
              placeholder={placeholderTags}
              name="basic"
              type="text"
              id="Tags"
            />
          </div>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-md">
          <div className="m-1 d-flex justify-content-center">
            <h3>
              <FormattedMessage id="upload-your-image" />
            </h3>
          </div>
          <div className="form-floating ">
            <div
              className="form-control"
              id="img"
              style={{ minHeight: 20, height: "100%" }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {images}
            </div>
            <label ref={imgLabelRef} htmlFor="img">
              <FormattedMessage id="drag-picture" />
            </label>
          </div>
        </div>
        <div className="col-md">
          <div className="m-1 d-flex justify-content-center">
            <h3>
              <FormattedMessage id="write-short-description" />
            </h3>
          </div>
          <div className="form-floating ">
            <textarea
              className="form-control"
              placeholder="Short description"
              id="shortDecr"
              style={{ height: "58px" }}
            ></textarea>
            <label ref={descrRef} htmlFor="shortDecr">
              <FormattedMessage id="short-description" />
            </label>
          </div>
        </div>
      </div>
      <div className="row g-5">
        <div className="col-md">
          <div className="m-1 d-flex justify-content-center">
            <h3>
              <FormattedMessage id="Add-a-new-name-of-chapter" />
            </h3>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              id="nameOfChapter"
              placeholder="Name of Chapter"
            />
            <label ref={chapterRef} htmlFor="nameOfChapter">
              <FormattedMessage id="name-chapter" />
            </label>
          </div>
        </div>
        <div className="col-md">
          <div className="m-1 d-flex justify-content-center">
            <h3>
              <FormattedMessage id="write-some-text" />
            </h3>
          </div>
          <div className="form-floating ">
            <ReactMde
              value={text}
              onChange={setText}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(<ReactMarkdown source={markdown} />)
              }
              childProps={{
                writeButton: {
                  tabIndex: -1,
                },
              }}
            />
          </div>
        </div>
        <div className="d-flex justify-content-center m-1">
          <button
            className="btn btn-info mt-5"
            onClick={AddChapter}
            style={{ width: "20%" }}
          >
            <FormattedMessage id="add-chapter.btn" />
          </button>
        </div>
      </div>

      {chapter.map((el, index) => {
        return (
          <div key={index}>
            <h3>
              Chapter {index + 1}. {el.name}
            </h3>
          </div>
        );
      })}
      <div className="d-flex justify-content-end mt-5">
        <button
          className="btn btn-success"
          onClick={postBook}
          style={{ width: "10%" }}
        >
          <FormattedMessage id="create.btn" />
        </button>
      </div>
    </div>
  );
}

export default injectIntl(CreateBook);
