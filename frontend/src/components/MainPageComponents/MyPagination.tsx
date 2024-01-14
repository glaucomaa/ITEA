import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export interface paginationProps {
  count: number;
  default: number;
  onChange: (num: number) => void;
}

export default function MyPagination(props: paginationProps) {
  return (
    <Stack spacing={2}>
      <Pagination
        defaultPage={props.default}
        page={props.default}
        sx={{
          mt: "2rem",
          display: "flex",
          justifyContent: "center",
          "& .MuiPaginationItem-root": {
            color: "white",
          },
        }}
        count={props.count}
        variant="outlined"
        color="secondary"
        onChange={(event, newPage) => {
          props.onChange(newPage);
          window.scrollTo(0, 500);
        }}
      />
    </Stack>
  );
}
