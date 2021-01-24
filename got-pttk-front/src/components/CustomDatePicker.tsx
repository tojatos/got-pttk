import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/FormLabel";
import TextField, { OutlinedTextFieldProps } from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    padding: `${theme.spacing(2)}px 0 ${theme.spacing(2)}px 0`,
    "& fieldset": {
      borderColor: theme.palette.primary.main,
      borderRadius: "17px",
    },
    "& input": {
      background: theme.palette.background.paper,
      borderRadius: "17px",
      padding: theme.spacing(2, 1, 2, 1),
    },
  },
  label: {
    marginTop: theme.spacing(2),
    color: theme.palette.common.white,
  },
}));

interface CustomDatepickerProps
  extends Omit<OutlinedTextFieldProps, "variant"> {
  label?: string;
}

export default function CustomDatepicker({
  label,
  ...props
}: CustomDatepickerProps) {
  const classes = useStyles();

  return (
    <>
      <InputLabel className={classes.label}>{label}</InputLabel>
      <TextField
        variant="outlined"
        className={classes.textField}
        type="date"
        {...props}
      />
    </>
  );
}
