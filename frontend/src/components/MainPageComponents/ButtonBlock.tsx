import { Box, Button } from "@mui/material";
import React from "react";
interface ButtonBlockProps {
  click: () => void;
}
const ButtonBlock = (props: ButtonBlockProps) => {
  return (
    <Box
      sx={{
        pt: 2.5,
        width: "80%",
        display: "flex",
        alignItems: "center",
        ml: "1rem",
        mr: "1rem",
      }}
    >
      <Button
        color="secondary"
        size="large"
        sx={{
          background: "linear-gradient(to  bottom, #0CFF73, #2F70FF)",
          borderRadius: "20px",
          mr: 1,
        }}
        onClick={() => {
          props.click();
        }}
      >
        Найти
      </Button>
    </Box>
  );
};

export default ButtonBlock;
