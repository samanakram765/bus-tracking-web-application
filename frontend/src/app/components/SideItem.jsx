import React from "react";
import { Link } from "react-router-dom";

const SideItem = ({
  color = "#ffffff",
  to,
  size = 20,
  text,
  Icon,
  target,
  handleClick,
  notifications,
  state,
}) => {
  return (
    <li className="side-item">
      <Icon color={color} size={size} />
      <Link
        onClick={handleClick}
        to={`/${to}`}
        className="item-text"
        target={target}
        state={state}
      >
        {text}
      </Link>
      <span className="number">{notifications !== 0 && notifications}</span>
    </li>
  );
};

export default SideItem;
