import React from "react";

function TextFieldComponent({ className, props }) {
  return <input className={`${className} `} {...props} />;
}

export default TextFieldComponent;
