import React from "react";
import { Loader } from "../loader/Loader";

export const ChapterText = ({ loading, book }) => {
  

  if (book.chapters === undefined) {
    return <Loader />;
  } else {
    return (
      <div className="container">
        {book.chapters.map((chapter, index) => {
          return (
            <div className="p-3" key={index}>
              <h1 className="text-center mt-2 mb-3">{chapter.name}</h1>
              <p className="fs-4">{chapter.text}</p>
            </div>
          );
        })}
      </div>
    );
  }
};
