import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SensorsIcon from "@mui/icons-material/Sensors";
import PlaceIcon from "@mui/icons-material/Place";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventService from "../API/EventsService";
import myEventInterface from "../interfaces/myEventInterface";

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<myEventInterface>({} as myEventInterface);
  async function fetchEvent(id: string | undefined) {
    const response = await EventService.getEventById(id);
    setEvent(response.data);
  }
  useEffect(() => {
    fetchEvent(id);
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          width: "80%",
          display: "flex",
          justifyContent: "start",
          ml: "1rem",
          mr: "1rem",
          mt: "1rem",
          background: "#11182b",
        }}
      >
        <Grid container>
          <Grid item xs={12} md={3}>
            <CardMedia
              sx={{ width: "80%", ml: "2rem", my: "1rem" }}
              component="img"
              style={{ maxWidth: "140px", maxHeight: "140px" }}
              image={event.image ? event.image : "/images/logo2.svg"}
              alt="image"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                color="white"
                variant="h4"
                component="div"
              >
                {event.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeFilledIcon
                  sx={{ color: "#0BFD71A8" }}
                  fontSize="small"
                />
                <Typography gutterBottom variant="body1" color="#2D7AF6">
                  {event.date}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceIcon sx={{ color: "#0BFD71A8" }} fontSize="small" />
                <Typography gutterBottom variant="body1" color="#2D7AF6">
                  {event.location}
                </Typography>
              </Stack>
              {event.location != "Онлайн" && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <SensorsIcon sx={{ color: "#0BFD71A8" }} fontSize="small" />
                  <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    color="#2D7AF6"
                  >
                    {event.form}
                  </Typography>
                </Stack>
              )}
            </CardContent>
          </Grid>
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <Button
                sx={{
                  background: "linear-gradient(to  bottom, #0CFF73, #2F70FF)",
                  borderRadius: "20px",
                }}
                disabled={!event.source}
                onClick={() => window.open(event.source)}
                type="submit"
                color="secondary"
                size="medium"
              >
                Зарегестрироваться
              </Button>
              {event.org && (
                <section>
                  <Typography
                    component="legend"
                    color="#0BFD71A8"
                    align="center"
                  >
                    Организаторы
                  </Typography>
                  <Typography color="white" align="center">
                    {event.org}
                  </Typography>
                </section>
              )}
            </CardActions>
          </Grid>
        </Grid>
      </Card>
      <Box
        sx={{
          backgroundImage: "url('/images/opacity.png')",
          backgroundSize: "65%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
          border: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {event.hasOwnProperty("info") ? (
          <Typography
            width={"90%"}
            color="white"
            component={"pre"}
            whiteSpace={"pre-wrap"}
            sx={{
              paddingX: 10,
              paddingY: 5,
            }}
          >
            {event.info}
          </Typography>
        ) : (
          <Typography color="white" sx={{ paddingX: 10, paddingY: 5 }}>
            Подробная информация о мероприятии отсутствует
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EventPage;
