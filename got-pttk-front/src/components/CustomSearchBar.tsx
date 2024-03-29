import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { InputBaseProps } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    borderRadius: "17px",
    marginLeft: 0,
    width: "100%",
  },
  searchIcon: {
    right: 0,
    top: 0,
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",

    "& :hover": {
      borderColor: theme.palette.common.white,
    },
  },
  inputInput: {
    padding: theme.spacing(2, 1, 2, 1),
    paddingRight: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
    background: theme.palette.background.paper,
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "17px",
  },
}));

interface CustomSearchProps extends InputBaseProps {
  className?: string;
}

export default function CustomSearch({
  className,
  ...props
}: CustomSearchProps) {
  const classes = useStyles();

  return (
    <div className={className + " " + classes.search}>
      <InputBase
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ "aria-label": "search" }}
        {...props}
      />
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
    </div>
  );
}
