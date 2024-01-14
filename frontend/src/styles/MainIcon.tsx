import { Icon } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const MainIcon = () => {
  const router = useNavigate();
  return (
    <Icon
      onClick={() => {
        router("/");
      }}
      sx={{ cursor: "pointer" }}
    >
      <img
        src="/images/logo2.svg"
        style={{ maxWidth: "24px", maxHeight: "24px" }}
      />
    </Icon>
  );
};

export default MainIcon;
