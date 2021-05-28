import React from "react";
export default function WhatsappPlugin(props) {
  return (
    <a
      href={`https://api.whatsapp.com/send?phone=+917888399184&text=Hello, I am ${
        props.name ? props.name : ""
      } want to share something!`}
      className="float"
      target="_blank"
    >
      <i className="fa fa-whatsapp my-float"></i>
    </a>
  );
}
