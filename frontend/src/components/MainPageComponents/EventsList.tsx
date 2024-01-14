import { Typography } from "@mui/material";
import React from "react";

import MediaCard from "./Cards/MediaCard";

import PastMediaCard from "./Cards/PastMediaCard";
import MyPagination from "./MyPagination";
interface myEventInterface {
  id: string;
  title: string;
  date: string;
  image?: string;
  form: string;
  save?: boolean;
  visited?: boolean;
  rate?: number;
}
interface ListProps {
  data: myEventInterface[];
  category: number;
  actualPage: number;
  setActualPage: any;
  totalPages: number;
}

export function EventsList(props: ListProps) {
  return (
    <>
      {props.data.length ? (
        props.category == 1 ? (
          props.data.map((dat) => (
            <PastMediaCard key={dat.visited + dat.id} data={dat} />
          ))
        ) : (
          props.data.map((dat) => (
            <MediaCard key={dat.save + dat.id} data={dat} />
          ))
        )
      ) : (
        <Typography
          align="center"
          color="white"
          fontSize={"2rem"}
          sx={{ mt: 5 }}
        >
          Ничего не найдено
        </Typography>
      )}
      {props.data.length ? (
        <MyPagination
          onChange={(num: number) => {
            props.setActualPage(num);
          }}
          default={props.actualPage}
          count={props.totalPages}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default EventsList;
