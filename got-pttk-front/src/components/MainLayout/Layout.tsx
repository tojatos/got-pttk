import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useState } from "react";
import AppBar from "./AppBar";
import SideBar from "./SideBar";

interface LayoutProps {
  children?: React.ReactNode | React.ReactNode[];
}

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    padding: `${theme.spacing(2)}px 10vw`,
  },
}));

function Layout(props: LayoutProps) {
  const classes = useStyles();
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
    <div>
      <AppBar openNav={() => setNavOpen(true)} />
      <SideBar navIsOpen={navOpen} closeNav={() => setNavOpen(false)} />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
