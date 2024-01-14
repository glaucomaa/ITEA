import {
  BottomNavigation,
  BottomNavigationAction,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PlaceIcon from "@mui/icons-material/Place";
import AnketaCardInterface from "../../interfaces/AnketaCardInterface";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
interface cardProps {
  data: AnketaCardInterface;
  onChange: (id: string, priority: number) => void;
}
const AnketaCard = (props: cardProps) => {
  const [priority, setPriority] = useState(2);
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "start",
        ml: "1rem",
        mr: "1rem",
        mt: "1.5rem",
        background: "#2C427375",
      }}
    >
      <Grid container sx={{ alignItems: "center" }}>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <CardMedia
            sx={{ width: "80%", mx: "1.5rem", my: "1rem" }}
            component="img"
            style={{ maxWidth: "140px", maxHeight: "140px" }}
            image={props.data.image ? props.data.image : "/images/logo2.svg"}
            alt="image"
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Grid item container>
              <Grid item xs={12} sm={6} sx={{ pb: "0.5rem" }}>
                <Typography color="white" fontSize={"1.5rem"} fontWeight="bold">
                  {props.data.title}
                </Typography>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sm={6}
                sx={{ justifyContent: "space-around" }}
              >
                <Stack direction="row" alignItems="center">
                  <PlaceIcon sx={{ color: "#4BD1D0" }} fontSize="small" />
                  <Typography
                    fontSize={"0.7rem"}
                    color="#0BFD71"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {props.data.form}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center">
                  <SupervisedUserCircleIcon
                    sx={{ color: "#4BD1D0" }}
                    fontSize="small"
                  />
                  <Typography
                    fontSize={"0.7rem"}
                    color="#0BFD71"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {props.data.organizer}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography fontSize={"1rem"} color="white">
                  {props.data.info}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
        <Grid item xs={12}>
          <CardActions>
            <BottomNavigation
              sx={{
                width: "100%",
                justifyContent: "space-between",
                flexWrap: "wrap",
                bgcolor: "#131E3A",
                "& .MuiBottomNavigationAction-label": {
                  color: "white",
                },
                "& .Mui-selected": {
                  "& .MuiBottomNavigationAction-label": {
                    color: "#0BFD71",
                  },
                },
              }}
              showLabels
              value={priority}
              onChange={(event, newValue) => {
                {
                  setPriority(newValue);
                  props.onChange(props.data.id, newValue);
                }
              }}
            >
              <BottomNavigationAction label="Нет" />
              <BottomNavigationAction label="Cкорее нет" />
              <BottomNavigationAction label="Возможно" />
              <BottomNavigationAction label="Cкорее да" />
              <BottomNavigationAction label="Да" />
            </BottomNavigation>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AnketaCard;
