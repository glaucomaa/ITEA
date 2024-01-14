import React, { useContext, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

import { useNavigate } from "react-router-dom";
import myEventInterface from "../../../interfaces/myEventInterface";

import { Context } from "../../../App";
import { observer } from "mobx-react-lite";

interface cardProps {
  data: myEventInterface;
}

const MediaCard = (props: cardProps) => {
  const { store } = useContext(Context);
  const { openModal } = useModal();
  const [isActive, setIsActive] = useState(true);
  const [save, setSave] = useState(props.data.save);
  const [color, setColor] = useState("white");
  const func_save = async () => {
    try {
      setIsActive(false);
      await store.appendSave(props.data.id);
      setSave(true);
    } catch (err: any) {
      store.supportAlertMessage = err?.response?.data.detail;
      store.supportAlertChange(true);
      setSave(false);
    } finally {
      setIsActive(true);
    }
  };
  const func_del_save = async () => {
    try {
      setIsActive(false);
      await store.delSave(props.data.id);
      setSave(false);
    } catch (err: any) {
      setSave(true);
      store.supportAlertMessage = err?.response?.data.detail;
      store.supportAlertChange(true);
    } finally {
      setIsActive(true);
    }
  };
  const router = useNavigate();
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "start",
        ml: "1rem",
        mr: "1rem",
        mt: "1rem",
        background: "#2C427375",
        borderRadius: "20px",
      }}
    >
      <Grid container sx={{ alignItems: "center" }}>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardMedia
            sx={{
              width: "100%",
              my: "1rem",
              mx: "1rem",
              borderRadius: "10px",
              maxHeight: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            component="img"
            style={{ width: "100px" }}
            image={props.data.image ? props.data.image : "/images/logo2.svg"}
            alt="image"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <PlaceIcon sx={{ color: "#4BD1D0" }} fontSize="small" />
              <Typography
                gutterBottom
                variant="body1"
                component="div"
                color="#0BFD71"
              >
                {props.data.form}
              </Typography>
            </Stack>

            <Typography
              align="center"
              gutterBottom
              variant="h5"
              component="div"
              sx={{ cursor: "pointer" }}
              color={color}
              onMouseEnter={() => {
                setColor("black");
              }}
              onMouseLeave={() => {
                setColor("white");
              }}
              onClick={() => {
                router(`/events/${props.data.id}`);
                window.scrollTo(0, 0);
              }}
            >
              {props.data.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeFilledIcon
                sx={{ color: "#4BD1D0" }}
                fontSize="small"
              />
              <Typography variant="body2" color="#0BFD71">
                {props.data.date}
              </Typography>
            </Stack>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" justifyContent="center">
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!save ? (
              <Button
                disabled={!isActive}
                size="small"
                variant="outlined"
                color="success"
                onClick={() => {
                  store.isAuth ? func_save() : openModal();
                }}
              >
                Сохранить
              </Button>
            ) : (
              <Button
                disabled={!isActive}
                size="small"
                variant="outlined"
                color="warning"
                onClick={() => {
                  func_del_save();
                }}
              >
                Убрать из сохранённых
              </Button>
            )}
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};
export default observer(MediaCard);
