import { Box, Button, Container, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import React from "react";
import { useNavigate } from "react-router-dom";
interface anketaModalprops {
  modalOpened: boolean;
  close: () => void;
}
const AnketaModal = (props: anketaModalprops) => {
  const router = useNavigate();
  return (
    <>
      <Modal
        open={props.modalOpened}
        onClose={() => {
          props.close();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 400,
            width: "80%",
            bgcolor: "#11182A",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: "20px",
          }}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
        >
          <Typography
            id="modal-modal-title"
            color="white"
            fontSize={"1rem"}
            component="h2"
            align="center"
            marginBottom={"1rem"}
          >
            Регистрация прошла успешно, теперь вы можете пройти анкетирование
            для подбора рекомендаций именно для вас
          </Typography>
          <Container
            sx={{
              marginTop: "1rem",
              marginBottom: "0.5rem",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              sx={{
                background: "linear-gradient(to  bottom, #0CFF73, #2F70FF)",
                borderRadius: "20px",
              }}
              color="secondary"
              size="large"
              onClick={() => {
                props.close();
                router("/anketa");
                window.scrollTo(0, 0);
              }}
            >
              Анкета
            </Button>
            <Button
              onClick={() => {
                props.close();
                window.scrollTo(0, 0);
              }}
              sx={{
                background: "#223C8261",
                borderRadius: "20px",
              }}
              color="secondary"
              size="large"
            >
              Позже
            </Button>
          </Container>
        </Box>
      </Modal>
    </>
  );
};

export default AnketaModal;
