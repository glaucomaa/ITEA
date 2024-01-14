import { Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
interface searchProps {
  value: string;
  changeValue: (newValue: string) => void;
}
const SearchInput = (props: searchProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.changeValue(event.target.value);
  };
  return (
    <TextField
      sx={{
        ml: "1rem",
        mr: "1rem",
        background: "#1D2C4C",
        borderRadius: "20px",
        input: { color: "#0BFD71A8" },
        label: { color: "#223C82" },
      }}
      fullWidth={true}
      variant="filled"
      label={
        <Container sx={{ display: "flex", alignItems: "center" }}>
          <SearchIcon />
          <Typography>Что вас интересует?...</Typography>
        </Container>
      }
      value={props.value}
      onChange={handleChange}
      size="small"
      margin="normal"
    />
  );
};

export default SearchInput;
