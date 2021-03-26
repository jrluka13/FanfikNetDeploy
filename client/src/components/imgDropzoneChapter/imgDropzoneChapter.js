import React, { useCallback, useRef, useState,useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { useDropzone } from "react-dropzone";
import { storage } from "../../firebase";

export const ImgDropzoneChapter = ({setUrlImgChapter}) => {
  const [files, setFiles] = useState([]);
  const imgLabelRef = useRef(null);
//   const [urlImg, setUrlImg] = useState();

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
  const getImg = useCallback(() => {
    if (files.length !== 0) {
      console.log(files[0]);
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
              setUrlImgChapter(url);
            });
        }
      );
    }
  }, [files,setUrlImgChapter]);
  useEffect(() => {
    getImg();
  }, [getImg]);
  return (
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
  );
};
