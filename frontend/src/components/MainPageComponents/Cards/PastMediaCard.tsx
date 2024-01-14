import React, { useContext, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  Rating,
  Stack,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";
import myEventInterface from "../../../interfaces/myEventInterface";
import { Context } from "../../../App";
import { useModal } from "../../../hooks/useModal";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";

interface cardProps {
  data: myEventInterface;
}

export default function MediaCard(props: cardProps) {
  const { store } = useContext(Context);
  const { openModal } = useModal();
  const [isActive, setIsActive] = useState(true);
  const [visited, setVisited] = useState(props.data.visited);
  const [rate, setRate] = useState(props.data.rate);
  const [color, setColor] = useState("white");
  const router = useNavigate();
  const func_visited = async () => {
    try {
      setIsActive(false);
      await store.appendVisit(props.data.id, 0);
      setVisited(true);
    } catch (err: any) {
      store.supportAlertMessage = err?.response?.data.detail;
      store.supportAlertChange(true);
      setVisited(false);
    } finally {
      setIsActive(true);
    }
  };
  const func_del_visited = async () => {
    try {
      setIsActive(false);
      await store.delVisit(props.data.id);
      setVisited(false);
    } catch (err: any) {
      store.supportAlertMessage = err?.response?.data.detail;
      store.supportAlertChange(true);
      setVisited(true);
    } finally {
      setIsActive(true);
    }
  };
  const func_rate = (num: number | null) => {
    setRate(Number(num));
    store.changeRate(Number(num), props.data.id);
  };
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
              mx: "1rem",
              my: "1rem",
              maxHeight: "150px",
              borderRadius: "10px",
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
          {!visited ? (
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Typography align="center" component="legend" color="white">
                {" "}
                Вы посетили данное мероприятие?
              </Typography>
              <Button
                disabled={!isActive}
                sx={{ mt: "1rem" }}
                size="small"
                color="success"
                variant="outlined"
                onClick={() => {
                  {
                    store.isAuth ? func_visited() : openModal();
                  }
                }}
              >
                Да
              </Button>
            </CardActions>
          ) : (
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Typography component="legend" color="white">
                Ваша оценка
              </Typography>
              <Rating
                disabled={!isActive}
                sx={{ mb: "1rem" }}
                value={rate}
                onChange={(event, num) => {
                  func_rate(num);
                }}
              />
              <Button
                disabled={!isActive}
                variant="outlined"
                size="small"
                color="warning"
                onClick={() => {
                  func_del_visited();
                  setRate(0);
                }}
              >
                Убрать из посещенных
              </Button>
            </CardActions>
          )}
        </Grid>
      </Grid>
    </Card>
  );
}
