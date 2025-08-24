import React from "react";
import PropTypes from "prop-types";

export default function CardTable({ children, color = "light" }) {
  return (
    <div
      className={
        "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
        (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
      }
    >
      {children}
    </div>
  );
}

CardTable.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["light", "dark"]),
};
