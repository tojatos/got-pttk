import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import logoPTTK from "../../assets/logoPTTK.png";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Routes } from "../../constant/Routes";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `solid 1px ${theme.palette.primary.main}`,
  },
  logo: {
    margin: theme.spacing(1),
    width: "3em",
  },
}));

interface MenuAppBarProps {
  openNav: () => void;
}

export default function MenuAppBar({ openNav }: MenuAppBarProps) {
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={openNav}
        >
          <MenuIcon />
        </IconButton>
        <Link to={Routes.HOME}>
          <img src={logoPTTK} alt="logo PTTK" className={classes.logo} />
        </Link>
      </Toolbar>
    </AppBar>
  );
}
