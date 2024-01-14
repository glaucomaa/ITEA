import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Container,
} from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import { Context } from "../../App";
import { useModal } from "../../hooks/useModal";

export interface eventNavigationProps {
  value: number;
  onChange: (num: number) => void;
}

export function EventNavigation(props: eventNavigationProps) {
  const { store } = useContext(Context);
  const { openModal } = useModal();
  return (
    <Container sx={{ mt: "1rem" }}>
      <BottomNavigation
        sx={{
          display: "flex",
          flexWrap: "wrap",
          bgcolor: "#11182b",
          "& .MuiBottomNavigationAction-label": {
            color: (theme) => theme.palette.primary.light,
          },
          "& .Mui-selected": {
            "& .MuiBottomNavigationAction-label": {
              fontSize: (theme) => theme.typography.caption,
              transition: "none",
              fontWeight: "bold",
              color: (theme) => theme.palette.secondary.main,
            },
          },
        }}
        showLabels
        value={props.value}
        onChange={(event, newValue) => {
          {
            newValue > 1 && !store.isAuth
              ? openModal()
              : props.onChange(newValue);
          }
        }}
      >
        <BottomNavigationAction label="Предстоящие" sx={{ mx: 1 }} />
        <BottomNavigationAction label="Прошедшие" sx={{ mx: 1 }} />
        <BottomNavigationAction label="Рекомендуемые" sx={{ mx: 1 }} />
        <BottomNavigationAction label="Сохранённые" sx={{ mx: 1 }} />
      </BottomNavigation>
    </Container>
  );
}
