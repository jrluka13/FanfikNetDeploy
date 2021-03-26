import React, {
  useRef,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { Loader } from "../loader/Loader";
import Tagify from "@yaireo/tagify";
import { injectIntl, FormattedMessage } from "react-intl";
import { useHttp } from "../../hooks/http.hook";
import { AuthContext } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import { useDropzone } from "react-dropzone";
import { storage } from "../../firebase";

import "react-mde/lib/styles/css/react-mde-all.css";
import classes from "./style.module.css";
import { ImgDropzoneChapter } from "../imgDropzoneChapter/imgDropzoneChapter";

function EditBookItems({ idBook, book, onChange, intl }) {
  const [selectedTab, setSelectedTab] = useState("write");
  const [text, setText] = useState();
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);
  const [urlImg, setUrlImg] = useState();
  const [urlImgChapter,setUrlImgChapter] = useState()
  const [defaultName,setDefaultName] = useState()

  const { request } = useHttp();
  const { token } = useContext(AuthContext);

  const divImgRef = useRef(null);
  const imgLabelRef = useRef(null);
  const divRef = useRef(null);
  const titleRef = useRef(null);
  const genreRef = useRef(null);
  const tagRef = useRef(null);
  const descrRef = useRef(null);
  const textareaRef = useRef(null);
  const chapterRef = useRef(null);
  const addChapterRef = useRef(null);
  const inputChapterRef = useRef(null);
  const placeholderTags = intl.formatMessage({ id: "write-some-tags" });
  const genres = [
    intl.formatMessage({ id: "genre-horor" }),
    intl.formatMessage({ id: "genre-health" }),
    intl.formatMessage({ id: "genre-erotica" }),
    intl.formatMessage({ id: "genre-science" }),
    intl.formatMessage({ id: "genre-fantasy" }),
  ];



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
      dropdown: {
        classname: "tags-look",
      },
      callbacks: {
        add: onTagsHandler, // callback when adding a tag
        remove: console.log, // callback when removing a tag
      },
    });
  }, [book]);

  const deleteChapter = async (id, index) => {
    try {
      await request(`/api/book/${id}/${index}`, "DELETE", null, {
        Authorization: `Bearer ${token}`,
      });
      onChange();
    } catch (error) {}
  };

  const addChapter = async (id,arr, obj) => {
    try {
      await request(`/api/book/${id}/${arr}`, "PUT", obj, {
        Authorization: `Bearer ${token}`,
      });
      onChange();
    } catch (error) {}
  };

  const updateChapter = useCallback(
    async (id,value) => {
      try {
        await request(`/api/book/${id}/chapter/obj`, "PUT", value, {
          Authorization: `Bearer ${token}`,
        });
        onChange();
        // getCommetsBook();
      } catch (error) {}
    },
    [token, request,onChange]
  );

  const onDeleteHandler = (index) => {
    deleteChapter(idBook.id, index);
  };

  const onAddChapter = () => {
    addChapterRef.current.style.display = "flex";
  };

  const AddChapter = () => {
    let obj = {
      name: inputChapterRef.current.value,
      text,
      urlImgChapter
    };
    addChapter(idBook.id,"chapters", obj);
  };

  const UpChapter = () => {
    let obj = {
      name: inputChapterRef.current.value,
      text,
      urlImgChapter,
      defaultName
    };
    updateChapter(idBook.id,obj);
  };

  const updateDataBook = useCallback(
    async (id, value) => {
      try {
        await request(`/api/book/${id}/up`, "PUT", value, {
          Authorization: `Bearer ${token}`,
        });
        onChange();
      } catch (error) {}
    },
    [token, request, onChange]
  );



  const onDataHandler = (e) => {
    let key = e.target.id;
    updateDataBook(idBook.id, { [key]: e.target.value });
    console.log({ [key]: e.target.value });
  };
  const onTagsHandler = (e) => {
    setTags((prev) => [...prev, { value: e.detail.data.value }]);
  };

  const updateTags = () => {
    updateDataBook(idBook.id, { tags });
  };

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

  const getImg = useCallback(() => {
    if (files.length !== 0) {
      console.log(files[0].name);
      const uploadTask = storage.ref(`images/${files[0].name}`).put(files[0]);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(files[0].name)
            .getDownloadURL()
            .then((url) => {
              console.log(url);
              setUrlImg(url);
            });
        }
      );
    }
  }, [files]);
  useEffect(() => {
    getImg();
  }, [getImg]);

  useEffect(() => {
    if (urlImg) {
      updateDataBook(idBook.id, { urlImg });
    }
  }, [urlImg,idBook.id,updateDataBook]);

  const addInfo=(chapter)=>{
    inputChapterRef.current.value = chapter.name
    setText(chapter.text)
    setDefaultName(chapter.default);
  }


  if (book.tags === undefined) {
    return <Loader />;
  } else {
    return (
      <div ref={divRef}>
        <div
          className="row mb-3"
          style={{ maxWidth: "1224px", minWidth: "250px" }}
        >
          <div className="row m-2">
            <div className="col-sm-4">
              <div className="card" style={{ border: "none" }}>
                <div className="card" style={{ border: "none" }}>
                  <img src={book.urlImg} alt="" />
                </div>
              </div>
              <div className="form-floating mt-2">
                <div
                  ref={divImgRef}
                  className="form-control"
                  id="img"
                  style={{ minHeight: 20, height: "100%" }}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {images}
                </div>
                <label
                  style={{ color: "black" }}
                  ref={imgLabelRef}
                  htmlFor="img"
                >
                  <FormattedMessage id="drag-picture" />
                </label>
              </div>
            </div>
            <div className="col-sm-8">
              <div className="card-body">
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="title"
                    defaultValue={book.title}
                    onBlur={(e) => onDataHandler(e)}
                  />
                  <label
                    ref={titleRef}
                    style={{ color: "black" }}
                    htmlFor="title"
                  >
                    <FormattedMessage id="title" />
                  </label>
                </div>
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="genre"
                    aria-label="Floating label select example"
                    placeholder="genre"
                    onBlur={(e) => onDataHandler(e)}
                  >
                    <option defaultValue={book.genre}>{book.genre}</option>
                    {genres.map((genre, index) => {
                      return (
                        <option key={index} defaultValue={genre}>
                          {genre}
                        </option>
                      );
                    })}
                  </select>
                  <label
                    ref={genreRef}
                    style={{ color: "black" }}
                    htmlFor="genre"
                  >
                    <FormattedMessage id="choose-your-genre" />
                  </label>
                </div>
                <div className="mt-2">
                  <div className="form-floating">
                    <input
                      ref={tagRef}
                      className="inputTag"
                      placeholder={placeholderTags}
                      name="basic"
                      type="text"
                      id="tags"
                    />
                  </div>
                  <button
                    className="d-flex justify-content-end btn btn-secondary"
                    onClick={updateTags}
                  >
                    Update tags
                  </button>
                </div>
                <h6 className="mt-2">
                  <small>
                    Tags:
                    {book.tags.map((tag, index) => (
                      <small key={index}> {tag.value} </small>
                    ))}
                  </small>
                </h6>
                <div className="form-floating ">
                  <textarea
                    className="form-control"
                    placeholder="Short description"
                    defaultValue={book.shortDecr}
                    ref={textareaRef}
                    id="shortDecr"
                    style={{ height: "200px" }}
                    onBlur={(e) => onDataHandler(e)}
                  ></textarea>
                  <label
                    ref={descrRef}
                    style={{ color: "black" }}
                    htmlFor="shortDecr"
                  >
                    <FormattedMessage id="short-description" />
                  </label>
                </div>
                <span className="d-flex justify-content-between mt-2">
                  <h4 className="card-text">
                    <FormattedMessage id="chapters" />{" "}
                  </h4>
                  <button
                    className={`btn btn-success ${classes["btn-circle"]} text-center  ms-2"`}
                    // style={classes['btn-circle']}
                    onClick={onAddChapter}
                  >
                    +
                  </button>
                </span>
                {book.chapters.map((chapter, index) => (
                  <span
                    onClick={()=>addInfo(chapter)}
                    className="d-flex justify-content-between mt-2"
                    key={index}
                    style={{cursor:"pointer"}}
                  >
                    <p>{chapter.name} </p>
                    <button
                      className={`btn btn-danger ${classes["btn-circle"]} text-center ms-2`}
                      onClick={() => onDeleteHandler(index)}
                    >
                      -
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div
          ref={addChapterRef}
          className="row g-5 me-1 ms-1"
          style={{ display: "none" }}
        >
          <div className="col-md">
            <div className="m-1 d-flex justify-content-center">
              <h3>
                <FormattedMessage id="Add-a-new-name-of-chapter" />
              </h3>
            </div>
            <div className="form-floating mb-2">
              <input
                ref={inputChapterRef}
                type="text"
                className="form-control"
                id="nameOfChapter"
                placeholder="Name of Chapter"
              />
              <label
                style={{ color: "black" }}
                ref={chapterRef}
                htmlFor="nameOfChapter"
              >
                <FormattedMessage id="name-chapter" />
              </label>
            </div>
            <img src={book.chapters.urlImgChapter} alt="" />
            <ImgDropzoneChapter setUrlImgChapter={setUrlImgChapter} />
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
          <div className="d-flex justify-content-center mb-5">
            <button
              className="btn btn-success mt-5"
              onClick={AddChapter}
              style={{ width: "20%" }}
            >
              <FormattedMessage id="add-chapter.btn" />
            </button>
            <button
              className="btn btn-info ms-4 mt-5"
              onClick={UpChapter}
              style={{ width: "20%" }}
            >
              <FormattedMessage id="up-chapter.btn" />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(EditBookItems);
