import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import logoPTTK from "../../assets/logoPTTK.png";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Routes } from "../../constant/Routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { Box, Button, Menu, MenuItem } from "@material-ui/core";
import { authLogout } from "../../app/authSlice";

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
  const authData = useSelector((state: RootState) => state.authData);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseClick = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    setAnchorEl(null);
    dispatch(authLogout());
  };

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={1}
        >
          <Box display="flex">
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
          </Box>
          <Box>
            {authData.login ? (
              <>
                <Button onClick={handleClick}>{authData.login}</Button>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleCloseClick}
                >
                  <MenuItem onClick={handleLogoutClick}>Wyloguj się</MenuItem>
                </Menu>
              </>
            ) : (
              <Link to={Routes.HOME}>
                <Button>Zaloguj się</Button>
              </Link>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
