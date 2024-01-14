import { Box, Button, Container, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnketaService from "../../API/AnketaService";
import { Context } from "../../App";
import AnketaCardInterface from "../../interfaces/AnketaCardInterface";
import AnketaCard from "./AnketaCard";

const Anketa = () => {
  const { store } = useContext(Context);
  const router = useNavigate();
  useEffect(() => {
    fetchEvents();
  }, []);
  const [events, setEvents] = useState<AnketaCardInterface[]>([]);
  async function fetchEvents() {
    const response = await AnketaService.getAnketaEvents();
    setEvents(response.data);
  }
  const anketa_priority = [
    { id: "id1", priority: 2 },
    { id: "id2", priority: 2 },
    { id: "id3", priority: 2 },
    { id: "id4", priority: 2 },
    { id: "id5", priority: 2 },
    { id: "id6", priority: 2 },
    { id: "id7", priority: 2 },
    { id: "id8", priority: 2 },
    { id: "id9", priority: 2 },
    { id: "id10", priority: 2 },
  ];
  const ChangePriority = (id: string, priority: number) => {
    let index = anketa_priority.findIndex((obj) => obj.id === id);
    anketa_priority[index].priority = priority;
  };
  return (
    <Container
      disableGutters
      sx={{
        mb: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: 800,
          my: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography fontSize={"1.7rem"} color="white" align="center">
          Отметьте, какие мероприятия вы бы предпочтительно посетили
        </Typography>
        <Typography
          variant="body1"
          color="#2D7AF6"
          align="center"
          sx={{ my: 1 }}
        >
          Это поможет порекомендовать лучшие мероприятия именно для вас
        </Typography>
        {events.map((event) => (
          <AnketaCard key={event.id} data={event} onChange={ChangePriority} />
        ))}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-around",
            marginTop: "3rem",
            marginBottom: "0.5rem",
            marginLeft: "0.5rem",
          }}
        >
          <Button
            color="secondary"
            size="large"
            sx={{
              background: "linear-gradient(to  bottom, #0CFF73, #2F70FF)",
              borderRadius: "20px",
            }}
            onClick={async () => {
              try {
                await AnketaService.postAnketaPriority(anketa_priority);
                store.user.anketaPassed = true;
                router("/");
                window.scrollTo(0, 0);
              } catch (err: any) {
                store.supportAlertMessage = err.message;
                store.supportAlertChange(true);
              }
            }}
          >
            Сохранить
          </Button>
          <Button
            sx={{
              background: "#223C8261",
              borderRadius: "20px",
            }}
            onClick={() => {
              router("/");
              window.scrollTo(0, 0);
            }}
            color="secondary"
            size="large"
          >
            Отмена
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default observer(Anketa);
