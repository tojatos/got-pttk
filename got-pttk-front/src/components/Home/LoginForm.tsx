import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomTextField from "../CustomTextField";
import CustomButton from "../CustomButton";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
}));

interface IFormInput {
  login: string;
  password: string;
}

export default function LoginForm() {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = ({ login, password }: IFormInput) => {
    //TODO: sign in user
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField
          label="Login"
          name="login"
          inputRef={register({ required: true })}
          error={!!errors.login}
          helperText={errors.login && "Podaj login"}
          fullWidth
        />
        <CustomTextField
          label="Hasło"
          name="password"
          type="password"
          inputRef={register({ required: true })}
          error={!!errors.password}
          helperText={errors.login && "Podaj hasło"}
          fullWidth
        />
        <CustomButton variant="contained" color="secondary" type="submit">
          Zaloguj
        </CustomButton>
      </form>
    </div>
  );
}
