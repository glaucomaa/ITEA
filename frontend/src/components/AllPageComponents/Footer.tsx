import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Container } from "@mui/system";
import React from "react";

export const Footer = () => {
  return (
    <footer style={{ marginTop: "auto" }}>
      <Box
        sx={{
          bgcolor: "#00000066",
          height: "7rem",
          width: "100%",
          mt: "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {" "}
        <Box sx={{ margin: "2rem" }}>
          <Typography sx={{ fontSize: 12 }} variant="h6" color="white">
            IT-ALLIGATOR, 2022
          </Typography>
          <Typography sx={{ fontSize: 12 }} variant="h6" color="white">
            it-alligator@gmail.com
          </Typography>
        </Box>
      </Box>
    </footer>
  );
};
