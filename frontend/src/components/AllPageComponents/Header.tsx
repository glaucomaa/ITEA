import {
  AppBar,
  Button,
  Toolbar,
  Grid,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SvgIcon,
  Stack,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../App";
import { useModal } from "../../hooks/useModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MainIcon from "../../styles/MainIcon";
//Компонент меню
const Header = () => {
  const { store } = useContext(Context);
  // хук для перехода между страницами
  const router = useNavigate();
  const { openModal } = useModal();

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={8} sm={7} md={9}>
            <Box sx={{ textAlign: "left", my: 1 }}>
              <Stack direction="row" alignItems="center">
                <MainIcon />
                <Button
                  disableRipple
                  color="inherit"
                  size="large"
                  onClick={() => {
                    router("/");
                  }}
                >
                  IT-ALLIGATOR
                </Button>
              </Stack>
            </Box>
          </Grid>
          {!store.isAuth ? (
            <Grid
              item
              xs={4}
              sm={5}
              md={3}
              display="flex"
              justifyContent={"center"}
              sx={{ flexWrap: "wrap" }}
            >
              {/* кнопка входа */}
              <Button color="success" size="large" onClick={openModal}>
                Войти
              </Button>
              <Button
                color="info"
                size="large"
                onClick={() => {
                  router("/sign-up");
                }}
              >
                Регистрация
              </Button>
            </Grid>
          ) : !store.user.anketaPassed ? (
            <Grid
              item
              xs={4}
              sm={5}
              md={3}
              display="flex"
              justifyContent={"center"}
            >
              <Accordion sx={{ backgroundColor: "#11182b" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="secondary" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography color="white">
                    {store.user.name} {store.user.lastName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      router(`/anketa`);
                      window.scrollTo(0, 0);
                    }}
                    color="#0BFD71A8"
                  >
                    Пройти анкету
                  </Typography>
                  <Typography
                    sx={{ cursor: "pointer", mt: 1 }}
                    onClick={() => {
                      store.logout();
                    }}
                    color="red"
                  >
                    Выйти
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ) : (
            <Grid
              item
              xs={4}
              sm={5}
              md={3}
              display="flex"
              justifyContent={"center"}
            >
              <Accordion
                sx={{
                  backgroundColor: "#11182b",
                  border: 0,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon color="secondary" />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography color="white">
                    {store.user.name} {store.user.lastName}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="#0BFD71A8">Анкета пройдена</Typography>
                  <Typography
                    sx={{ cursor: "pointer", mt: 1 }}
                    onClick={() => {
                      store.logout();
                    }}
                    color="red"
                  >
                    Выйти
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);
