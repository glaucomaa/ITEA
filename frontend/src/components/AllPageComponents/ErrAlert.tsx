import { Alert, Collapse, Snackbar } from "@mui/material";
import React from "react";
interface ErrAlertProps {
  alertOpen: boolean;
  alertContent: string;
  close: () => void;
}
const ErrAlert = (props: ErrAlertProps) => {
  return (
    <Snackbar
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      open={props.alertOpen}
      autoHideDuration={6000}
      onClose={() => {
        props.close();
      }}
    >
      <Collapse in={props.alertOpen}>
        <Alert
          severity="error"
          variant="filled"
          sx={{ mt: 1 }}
          onClose={() => {
            props.close();
          }}
        >
          {props.alertContent}
        </Alert>
      </Collapse>
    </Snackbar>
  );
};

export default ErrAlert;
