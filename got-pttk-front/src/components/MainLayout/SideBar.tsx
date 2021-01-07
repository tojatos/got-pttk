import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu";
import { NavConfig } from "../../constant/NavConfig";
import { UserRoles } from "../../constant/User";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  menuBox: {
    paddingLeft: theme.spacing(3),
    borderBottom: `solid 1px ${theme.palette.primary.main}`,
    borderRight: `solid 1px ${theme.palette.primary.main}`,
    minHeight: "64px",
    display: "flex",
    alignItems: "center",
  },
  listLabel: {
    paddingLeft: theme.spacing(4),
  },
}));

interface SideBarProps {
  closeNav: () => void;
  navIsOpen: boolean;
}

const SideBar = ({ closeNav, navIsOpen }: SideBarProps) => {
  const classes = useStyles();
  const role = UserRoles.LEADER; //TODO: get role from store

  return (
    <nav>
      <Drawer anchor="left" open={navIsOpen}>
        <Box className={classes.menuBox}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={closeNav}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <List>
          {NavConfig.find((e) => e.user === role)?.routes.map((route, i) => (
            <ListItem key={i} button component={RouterLink} to={route.path}>
              <ListItemText
                primary={route.label}
                className={classes.listLabel}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </nav>
  );
};

export default SideBar;
