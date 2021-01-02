import React from "react";
import { useState } from "react";
import AppBar from "./AppBar";
import SideBar from "./SideBar";

interface LayoutProps {
  children?: JSX.Element;
}

function Layout(props: LayoutProps) {
  const [navOpen, setNavOpen] = useState<boolean>(false);

  return (
  <div>
    <AppBar openNav={() => setNavOpen(true)} />
    <SideBar navIsOpen={navOpen} closeNav={() => setNavOpen(false)} />
    <main> 
      {props.children}
    </main>
  </div>);
}

export default Layout;
