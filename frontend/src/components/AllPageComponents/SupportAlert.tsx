import { Alert, Snackbar } from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "../../App";

const SupportAlert = () => {
  const { store } = useContext(Context);
  return (
    <Snackbar
      open={store.supportAlertIsOpen}
      autoHideDuration={5000}
      onClose={() => {
        store.supportAlertChange(false);
      }}
    >
      <Alert
        onClose={() => {
          store.supportAlertChange(false);
        }}
        severity="error"
        sx={{ width: "100%" }}
      >
        {store.supportAlertMessage}
      </Alert>
    </Snackbar>
  );
};

export default observer(SupportAlert);
