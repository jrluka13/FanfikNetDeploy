import React, { useEffect, useRef, useState, useContext } from "react";
import { SwitchCheckedContext } from "../../context/SwitchCheckedContext";
import { AuthContext } from "../../context/AuthContext";

const colors = [
  "#4c31f6",
  "#216c5a",
  "#138412",
  "#a67fdc",
  "#cacba1",
  "#52dc98",
  "#97eb5f",
  "#e6043a",
  "#356222",
  "#a0439b",
  "#b78657",
  "#34b4cb",
  "#5ab8fd",
];

export const CloudTags = ({ books, visibility }) => {
    const { checked } = useContext(SwitchCheckedContext);

  const [countTags, setCountTags] = useState();
  const divRef = useRef(null);

  useEffect(() => {
    if (checked) {
      let theme = JSON.parse(localStorage.getItem("theme"));

      divRef.current.classList.add(theme["bg-dark"]);
    } else if (!checked) {
      divRef.current.classList.remove("bg-dark");
    }
  }, [divRef, checked]);


  function unique(arr) {
    let result = {};
    // let obj = {}
    arr.forEach((a) => {
      result[a] = result[a] + 1 || 1;
    });

    return result;
  }

  useEffect(() => {
    let arr = [];

    books.map((book) => {
      book.tags.map((tag) => {
        arr.push(tag.value);
      });
    });
    setCountTags(unique(arr));
  }, [books, setCountTags]);



  return (
    <div
      ref={divRef}
      className="d-flex justify-content-center mb-4 rounded-pill"
      style={{
        ...visibility,
        width: "100%",
        fontSize: "18px",
        background: "#fff",
      }}
    >
      {countTags &&
        Object.keys(countTags).map((tag, index) => {
          return (
            <span
              key={index}
              className="m-2"
              style={{
                fontSize: `${(countTags[tag] * 500) / 50}px`,
                color: colors[(countTags[tag] % colors.length) - 1],
              }}
            >
              {tag}
            </span>
          );
        })}
    </div>
  );
};
