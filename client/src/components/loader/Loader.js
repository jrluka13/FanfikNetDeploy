import React from "react";

export const Loader = ({style}) => {
  return (

    <div style={style} className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
