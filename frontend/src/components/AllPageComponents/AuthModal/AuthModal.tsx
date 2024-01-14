import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useContext, useState } from "react";
import { useModal } from "../../../hooks/useModal";
import { Container, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useController,
  useForm,
  Controller,
  SubmitHandler,
  useFormState,
} from "react-hook-form";
import {
  buttonContainer,
  cancelButtonStyle,
  inputStyle,
  loginButtonStyle,
  modalBoxStyle,
} from "./styles";
import { emailValidation, passwordValidation } from "./validation";
import { Context } from "../../../App";
import ErrAlert from "../ErrAlert";

interface ISignForm {
  email: string;
  password: string;
}

export default function AuthModal() {
  const { store } = useContext(Context);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<ISignForm>({ mode: "onChange" });
  const { errors } = useFormState({ control });
  const { modalOpened, closeModal } = useModal();
  const [isActive, setActive] = useState(true);
  const router = useNavigate();
  const onSubmit: SubmitHandler<ISignForm> = async (data) => {
    setActive(false);
    try {
      await store.login(data.email, data.password);
      router("/");
      closeModal();
      reset();
    } catch (err: any) {
      setAlertContent(err?.response?.data.detail);
      setAlertOpen(true);
    } finally {
      setActive(true);
    }
  };
  return (
    <>
      <Modal
        open={modalOpened}
        onClose={() => {
          closeModal();
          reset();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={modalBoxStyle}
          display="flex"
          flexDirection={"column"}
          alignItems="center"
        >
          <Typography
            id="modal-modal-title"
            color="white"
            variant="h6"
            component="h2"
            align="center"
            marginBottom={"1rem"}
          >
            Вход в систему
          </Typography>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Controller
              control={control}
              name="email"
              rules={emailValidation}
              render={({ field }) => (
                <TextField
                  sx={inputStyle}
                  label="email..."
                  size="small"
                  margin="none"
                  fullWidth={true}
                  variant="filled"
                  onChange={(e) => field.onChange(e)}
                  value={field.value}
                  error={!!errors.email?.message}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={passwordValidation}
              render={({ field }) => (
                <TextField
                  sx={inputStyle}
                  variant="filled"
                  type="password"
                  label="пароль..."
                  size="small"
                  margin="normal"
                  fullWidth={true}
                  onChange={(e) => field.onChange(e)}
                  value={field.value}
                  error={!!errors.password?.message}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Container sx={buttonContainer}>
              <Button
                disabled={!isValid || !isActive}
                sx={loginButtonStyle}
                type="submit"
                color="secondary"
                size="large"
              >
                Войти
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                  reset();
                }}
                sx={cancelButtonStyle}
                color="secondary"
                size="large"
              >
                Отмена
              </Button>
            </Container>
            <Button
              onClick={() => {
                closeModal();
                router("/sign-up");
              }}
              sx={{ color: "#4BD1D0" }}
              size="medium"
            >
              Регистрация
            </Button>
          </form>
          <ErrAlert
            alertContent={alertContent}
            alertOpen={alertOpen}
            close={() => setAlertOpen(false)}
          />
        </Box>
      </Modal>
    </>
  );
}
