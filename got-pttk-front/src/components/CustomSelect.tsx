import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/FormLabel";
import { FormControl, Select } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
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

interface CustomSelectProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  handleChange: (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) => void;
}

export default function CustomSelect({
  label,
  name,
  value,
  options,
  handleChange,
  ...props
}: CustomSelectProps) {
  const classes = useStyles();

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        native
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{
          name: { name },
        }}
      >
        {options.map((e: string) => (
          <option value={e} />
        ))}
      </Select>
    </FormControl>
  );
}
