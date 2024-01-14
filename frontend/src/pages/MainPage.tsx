import React, { useContext, useEffect } from "react";
import "../styles/App.css";
import { Box, Container, Grid } from "@mui/material";
import { useState } from "react";
import { EventNavigation } from "../components/MainPageComponents/EventNavigation";
import Welcome from "../components/MainPageComponents/Welcome";
import EventService from "../API/EventsService";
import { getPagesCount } from "../components/utils/getPagesCount";
import EventsList from "../components/MainPageComponents/EventsList";
import AuthModal from "../components/AllPageComponents/AuthModal/AuthModal";
import myEventInterface from "../interfaces/myEventInterface";
import { Context } from "../App";
import { observer } from "mobx-react-lite";
import SearchInput from "../components/MainPageComponents/SearchInput";
import ButtonBlock from "../components/MainPageComponents/ButtonBlock";
import Loader from "../components/AllPageComponents/Loader";

const MainPage = () => {
  //состояние, в котором хранится информация о всех мероприятиях
  const [data, setData] = useState<myEventInterface[]>([]);
  //состояние, в котором хранится номер выбранной категории мероприятий (предстоящие, прошедшие, рекомендуемые, сохраненные)
  const [selectCategory, setSelectCategory] = useState(0);
  //состояние, в котором хранится номер открытой в данный момент страницы в списке мероприятий
  const [actualPage, setActualPage] = useState(1);
  //состояние, в котором хранится общее количество мероприятий
  const [totalCount, setTotalCount] = useState(0);
  //состояние, в котором хранится лимит на количество ивентов на одной странице
  const [limit, setLimit] = useState(4);
  //состояние, в котором хранится общее количество страниц
  const [totalPages, setTotalPages] = useState(0);
  const { store } = useContext(Context);
  const [tempSearchValue, setTempSeacrhValue] = useState("");
  const [searchValue, setSeacrhValue] = useState("");

  useEffect(() => {
    if (selectCategory == 0 && actualPage == 1 && searchValue == "") {
      if (!store.isAuth) {
        setData(
          data.map((item) => {
            return { ...item, save: false };
          })
        );
      }
    } else {
      fetchEvents();
    }

    setSelectCategory(0);
    setActualPage(1);
    setSeacrhValue("");
    setTempSeacrhValue("");
  }, [store.isAuth]);

  useEffect(() => {
    fetchEvents();
  }, [actualPage, selectCategory, searchValue]);

  async function fetchEvents() {
    try {
      store.setEventLoader(true);
      if (selectCategory == 0) {
        const response = await EventService.getEvents(
          limit,
          actualPage,
          searchValue
        );
        setData(response.data);
        setTotalCount(Number(response.headers["x-total-count"]));
        setTotalPages(
          getPagesCount(Number(response.headers["x-total-count"]), limit)
        );
      }
      if (selectCategory == 1) {
        const response = await EventService.getPastEvents(
          limit,
          actualPage,
          searchValue
        );
        setData(response.data);
        setTotalCount(Number(response.headers["x-total-count"]));
        setTotalPages(
          getPagesCount(Number(response.headers["x-total-count"]), limit)
        );
      }
      if (selectCategory == 2) {
        const response = await EventService.getRecomendedEvents(
          limit,
          actualPage,
          searchValue
        );
        setData(response.data);
        setTotalCount(Number(response.headers["x-total-count"]));
        setTotalPages(
          getPagesCount(Number(response.headers["x-total-count"]), limit)
        );
      }
      if (selectCategory == 3) {
        const response = await EventService.getSavedEvents(
          limit,
          actualPage,
          searchValue
        );
        setData(response.data);
        setTotalCount(Number(response.headers["x-total-count"]));
        setTotalPages(
          getPagesCount(Number(response.headers["x-total-count"]), limit)
        );
      }
    } catch (err: any) {
      store.supportAlertMessage = err?.response?.data.detail;
      store.supportAlertChange(true);
    } finally {
      store.setEventLoader(false);
    }
  }
  return (
    <>
      <Container
        disableGutters
        sx={{
          px: "1rem",
          mb: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Welcome />
        <EventNavigation
          value={selectCategory}
          onChange={(num: number) => {
            setSelectCategory(num);
            setSeacrhValue("");
            setTempSeacrhValue("");
            setActualPage(1);
          }}
        />
        <Grid container>
          <Grid item md={11} xs={12} display="flex" alignItems="center">
            <SearchInput
              value={tempSearchValue}
              changeValue={(newValue: string) => {
                setTempSeacrhValue(newValue);
              }}
            />
          </Grid>
          <Grid item md={1} xs={12}>
            <ButtonBlock
              click={() => {
                setSeacrhValue(tempSearchValue);
                setActualPage(1);
              }}
            />
          </Grid>
        </Grid>
        {store.eventLoader ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <Loader />
          </Box>
        ) : (
          <EventsList
            data={data}
            category={selectCategory}
            actualPage={actualPage}
            setActualPage={setActualPage}
            totalPages={totalPages}
          />
        )}
      </Container>
    </>
  );
};

export default observer(MainPage);
