import { Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import { NavConfig } from "../constant/NavConfig";
import { UserRoles } from "../constant/User";
import { Link } from "react-router-dom";

const SideBar = () => {
  const role =  UserRoles.LEADER//TODO: get role from store

  return (
    <nav>
        <Drawer>
            <List>
            {NavConfig.find(e => e.user === role)?.routes.map(((route, i) => (
                <Link to={route.path}>
                <ListItem button key={i}>
                    <ListItemText primary={route.label} />
                </ListItem>
                </Link>
            )))}
            </List>
        </Drawer>
    </nav>
  );
};

export default SideBar;