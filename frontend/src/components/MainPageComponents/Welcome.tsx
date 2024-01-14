import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import React from "react";

const Welcome = () => {
  return (
    <Container sx={{ my: "5rem", ml: "1rem", mr: "1rem" }}>
      <Grid container>
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontSize={"3rem"}
            color="white"
            sx={{ fontWeight: "bold" }}
          >
            IT Мероприятия на каждый день
          </Typography>
          <Divider sx={{ height: "1.5rem" }} />
          <Typography color="#4BD1D0" fontSize={"1.5rem"}>
            Найди событие интересное именно тебе
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img style={{ maxWidth: "65%" }} src="\images\imagu_krug.png" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Welcome;
