import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CustomTextField from "../CustomTextField";
import CustomButton from "../CustomButton";

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
  link: {
    color: theme.palette.common.white,
    textDecoration: "none",
    "&:visited": {
      color: theme.palette.common.white,
    },
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function LoginForm() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <form>
        <CustomTextField label="Login" fullWidth />
        <CustomTextField label="Hasło" type="password" fullWidth />
        <CustomButton variant="contained" color="secondary" type="submit">
          Zaloguj
        </CustomButton>
      </form>
    </div>
  );
}
